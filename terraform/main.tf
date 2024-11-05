provider "aws" {
  region     = var.aws_region
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}

variable "aws_access_key" {
  description = "AWS Access Key"
}

variable "aws_secret_key" {
  description = "AWS Secret Key"
}

variable "aws_region" {
  default = "us-east-1"
}

# Security Group para la instancia
resource "aws_security_group" "docker_sg" {
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

# Instancia EC2 con Docker
resource "aws_instance" "docker_instance" {
  ami           = "ami-0c55b159cbfafe1f0" # Ubuntu Server AMI
  instance_type = "t3.medium"
  security_groups = [aws_security_group.docker_sg.name]
  tags = {
    Name = "docker-instance"
  }

  # Provisioner para copiar el archivo docker-compose.yml
  provisioner "file" {
    source      = "../docker-compose.yml"
    destination = "/home/ubuntu/docker-compose.yml"

    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = file("path/to/your/private-key.pem") # Cambia esta ruta
      host        = self.public_ip
    }
  }
}

output "instance_ip" {
  description = "Dirección IP pública de la instancia EC2"
  value       = aws_instance.docker_instance.public_ip
}


