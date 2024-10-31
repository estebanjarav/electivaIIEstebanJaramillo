provider "aws" {
  region = var.aws_region
}

variable "aws_region" {
  default = "us-east-1"
}

# VPC para ECS
resource "aws_vpc" "vpc" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "ecs-vpc"
  }
}

# Subnet pública
resource "aws_subnet" "public_subnet" {
  vpc_id                  = aws_vpc.vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "us-east-1a"
  tags = {
    Name = "public-subnet"
  }
}

# Security Group para los contenedores ECS
resource "aws_security_group" "ecs_sg" {
  vpc_id = aws_vpc.vpc.id

  ingress {
    from_port   = 4001
    to_port     = 4001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 27017
    to_port     = 27017
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Repositorio ECR para la imagen de auth-service
resource "aws_ecr_repository" "auth_service" {
  name = "auth-service"
}

# Clúster ECS
resource "aws_ecs_cluster" "ecs_cluster" {
  name = "auth-service-cluster"
}

# Definición de la Tarea ECS
resource "aws_ecs_task_definition" "auth_service_task" {
  family                   = "auth-service-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 512
  memory                   = 1024

  container_definitions = jsonencode([
    {
      name      = "mongodb"
      image     = "mongo:latest"
      essential = true
      environment = [
        { name = "MONGO_INITDB_ROOT_USERNAME", value = "root" },
        { name = "MONGO_INITDB_ROOT_PASSWORD", value = "example" }
      ]
      portMappings = [
        { containerPort = 27017, hostPort = 27017 }
      ]
    },
    {
      name      = "auth-service"
      image     = aws_ecr_repository.auth_service.repository_url
      essential = true
      environment = [
        { name = "PORT", value = "4001" },
        { name = "JWT_SECRET", value = "A1B2C3" },
        { name = "MONGO_URL", value = "mongodb://root:example@mongodb:27017/auth-service?authSource=admin" }
      ]
      portMappings = [
        { containerPort = 4001, hostPort = 4001 }
      ]
    }
  ])
}

# Servicio ECS para lanzar la tarea
resource "aws_ecs_service" "auth_service" {
  name            = "auth-service"
  cluster         = aws_ecs_cluster.ecs_cluster.id
  task_definition = aws_ecs_task_definition.auth_service_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = [aws_subnet.public_subnet.id]
    security_groups = [aws_security_group.ecs_sg.id]
    assign_public_ip = true
  }
}

# Salidas del Despliegue
output "ecr_repository_url" {
  description = "URL del repositorio ECR"
  value       = aws_ecr_repository.auth_service.repository_url
}

output "ecs_service_name" {
  description = "Nombre del servicio ECS"
  value       = aws_ecs_service.auth_service.name
}
