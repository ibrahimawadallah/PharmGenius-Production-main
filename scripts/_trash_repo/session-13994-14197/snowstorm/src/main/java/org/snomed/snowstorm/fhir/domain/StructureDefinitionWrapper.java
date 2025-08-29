package org.snomed.snowstorm.fhir.domain;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.parser.IParser;

import org.hl7.fhir.r4.model.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.data.elasticsearch.annotations.Document;

@Document(indexName = "#{@indexNameProvider.indexName('fhir-structure-definition')}", createIndex = false)
public class StructureDefinitionWrapper {
	
	private static IParser fhirJsonParser;
	
	@Id
	private String id;
	
	private StructureDefinition structureDefinition;

	@SuppressWarnings("unused")
	public StructureDefinitionWrapper () {
	}

	@PersistenceCreator
	public StructureDefinitionWrapper (IdType id, StructureDefinition vs) {
		this.structureDefinition = vs;
		this.id = id.getIdPart();
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
		if (structureDefinition != null) {
			this.structureDefinition.setId(id);
		}
	}

	public StructureDefinition getStructureDefinition() {
		return structureDefinition;
	}

	@SuppressWarnings("unused")
	public void setStructureDefinition(StructureDefinition structureDefinition) {
		this.structureDefinition = structureDefinition;
	}
	
	public static IParser getFhirParser() {
		if (fhirJsonParser == null) {
			fhirJsonParser = FhirContext.forR4().newJsonParser();
		}
		return fhirJsonParser;
	}
	
}
