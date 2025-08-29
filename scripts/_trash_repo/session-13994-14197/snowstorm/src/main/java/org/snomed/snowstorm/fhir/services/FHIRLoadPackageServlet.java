package org.snomed.snowstorm.fhir.services;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.parser.IParser;
import org.apache.commons.io.IOUtils;
import org.hl7.fhir.r4.model.OperationOutcome;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import jakarta.servlet.ServletConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Part;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

public class FHIRLoadPackageServlet extends HttpServlet {

	private static final String MULTIPART_FORM_DATA = "multipart/form-data";

	private FHIRLoadPackageService service;

	private FhirContext fhirContext;

	@Override
	public void init(ServletConfig config) throws ServletException {
		final WebApplicationContext applicationContext =
				WebApplicationContextUtils.getWebApplicationContext(config.getServletContext());

		service = applicationContext.getBean(FHIRLoadPackageService.class);
		fhirContext = applicationContext.getBean(FhirContext.class);
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		String contentType = req.getContentType();
		if (!contentType.startsWith(MULTIPART_FORM_DATA)) {
			badRequest("Request must use content type " + MULTIPART_FORM_DATA, resp);
			return;
		}
		Part filePart = req.getPart("file");
		if (filePart == null) {
			badRequest("Request must include \"file\" parameter.", resp);
			return;
		}
		String submittedFileName = filePart.getSubmittedFileName();
		File tempFile = File.createTempFile("fhir-bundle-upload-" + UUID.randomUUID(), ".tgz");
		try (InputStream inputStream = filePart.getInputStream()) {
			Files.copy(inputStream, tempFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
		}

		Set<String> resourceUrls = new HashSet<>();
		boolean testValueSets = false;
		for (Part part : req.getParts()) {
			if ("resourceUrls".equals(part.getName())) {
				resourceUrls.add(IOUtils.toString(part.getInputStream(), StandardCharsets.UTF_8));
			}
			if ("testValueSets".equals(part.getName()) && Boolean.parseBoolean(IOUtils.toString(part.getInputStream(), StandardCharsets.UTF_8))) {
				testValueSets = true;
			}
		}

		if (resourceUrls.isEmpty()) {
			badRequest("Request must include one or more \"resourceUrls\" parameters. Use resourceUrls=* to import all resources in the package.", resp);
			return;
		}

		try {
			service.uploadPackageResources(tempFile, resourceUrls, submittedFileName, testValueSets);
		} catch (SnowstormFHIRServerResponseException e) {
			error(e, resp);
			return;
		}
		resp.setStatus(200);
	}

	private void badRequest(String message, HttpServletResponse resp) throws IOException {
		SnowstormFHIRServerResponseException exception = FHIRHelper.exception(message, OperationOutcome.IssueType.NOTSUPPORTED, 400);
		error(exception, resp);
	}

	private void error(SnowstormFHIRServerResponseException exception, HttpServletResponse resp) throws IOException {
		resp.setStatus(exception.getStatusCode());
		IParser jsonParser = fhirContext.newJsonParser();
		jsonParser.setPrettyPrint(true);
		jsonParser.encodeResourceToWriter(exception.getOperationOutcome(), new OutputStreamWriter(resp.getOutputStream()));
	}

}
