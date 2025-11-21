-- Migration: add id_domiciliario column and index/foreign key to domicilios
-- Backup your DB before running.

-- Check current structure:
-- DESCRIBE domicilios;

-- Add column (nullable)
ALTER TABLE domicilios
  ADD COLUMN id_domiciliario INT NULL AFTER id_usuario;

-- Add index to speed queries
CREATE INDEX idx_id_domiciliario ON domicilios(id_domiciliario);

-- Add foreign key constraint (requires both tables to be InnoDB)
ALTER TABLE domicilios
  ADD CONSTRAINT fk_domicilios_id_domiciliario FOREIGN KEY (id_domiciliario) REFERENCES usuarios(id_usuario);

-- Optional: add domicilio_id to notificaciones for linking notifications -> domicilios
-- ALTER TABLE notificaciones
--   ADD COLUMN domicilio_id INT NULL AFTER id_pedido;
-- CREATE INDEX idx_notificaciones_domicilio ON notificaciones(domicilio_id);
-- ALTER TABLE notificaciones
--   ADD CONSTRAINT fk_notificaciones_domicilio FOREIGN KEY (domicilio_id) REFERENCES domicilios(id_domicilio);
