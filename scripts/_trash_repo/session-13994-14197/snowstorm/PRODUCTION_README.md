# Snowstorm Production Configuration
# This is your main SNOMED CT terminology server

# Docker Compose for production
# Run with: docker-compose up -d

# API Endpoints:
# - FHIR API: http://localhost:8080/fhir
# - SNOMED Browser: http://localhost
# - Health Check: http://localhost:8080/health

# Production Settings:
# - Memory: 4GB+ for Elasticsearch
# - Storage: Persistent volumes for data
# - Security: Enable authentication for production
# - Monitoring: Health checks and logging

# Integration with your medical database:
# - Use snomed_integration.py to connect
# - API calls to enhance drug and ICD-10 data
# - Clinical decision support features
