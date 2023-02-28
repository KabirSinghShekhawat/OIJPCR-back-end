mongo:
	docker run --name oijpcr-db --network=host -d mongo:latest
start:
	npm run dev
