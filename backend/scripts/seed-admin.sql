-- Seed: user admin default

USE order_management;

INSERT INTO users (name, email, password_hash, role)
VALUES (
  'Admin',
  'admin@orderly.com',
  '$2b$10$I6qJbXCxOrE0iUqw/hCNj.B2bSbednsYdhaq1KbSZ7kn5WyZPAbIa',
  'admin'
);