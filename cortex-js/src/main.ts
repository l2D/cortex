import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import {
  defaultCortexJsHost,
  defaultCortexJsPort,
} from '@/infrastructure/constants/cortex';
import { FileManagerService } from './infrastructure/services/file-manager/file-manager.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
    cors: true,
  });

  const fileService = app.get(FileManagerService);
  await fileService.getConfig();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      enableDebugMessages: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Cortex API')
    .setDescription(
      'Cortex API provides a command-line interface (CLI) for seamless interaction with large language models (LLMs). Fully compatible with the [OpenAI API](https://platform.openai.com/docs/api-reference), it enables straightforward command execution and management of LLM interactions.',
    )
    .setVersion('1.0')
    .addTag(
      'Inference',
      'This endpoint initiates interaction with a Language Learning Model (LLM).',
    )
    .addTag(
      'Assistants',
      'These endpoints manage the lifecycle of an Assistant within a conversation thread.',
    )
    .addTag(
      'Models',
      'These endpoints provide a list and descriptions of all available models within the Cortex framework.',
    )
    .addTag(
      'Messages',
      'These endpoints manage the retrieval and storage of conversation content, including responses from LLMs and other metadata related to chat interactions.',
    )
    .addTag(
      'Threads',
      'These endpoints handle the creation, retrieval, updating, and deletion of conversation threads.',
    )
    .addTag(
      'Embeddings',
      'Endpoint for creating and retrieving embedding vectors from text inputs using specified models.',
    )
    .addTag(
      'Status',
      "Endpoint for actively querying the health status of the Cortex's API server.",
    )
    .addTag(
      'Processes',
      'Endpoint for terminating the Cortex API server processes.',
    )
    .addTag(
      'Events',
      'Endpoints for  observing Cortex statuses through event notifications.',
    )    
    .addServer('http://localhost:1337')
    .addServer('http://localhost:1337/v1')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  // getting port from env
  const host = process.env.CORTEX_JS_HOST || defaultCortexJsHost;
  const port = process.env.CORTEX_JS_PORT || defaultCortexJsPort;

  await app.listen(port, host);
  console.log(`Started server at http://${host}:${port}`);
  console.log(`Swagger UI available at http://${host}:${port}/api`);
}

bootstrap();
