INSERT INTO departments (name)
VALUES  
('EHS'),
('Research Dev'),
('Process Dev'),
('Manufacturing'),
('Corporate');

INSERT INTO roles (title, salary, department_id)
VALUES  
('EHS Associate', 10000, 1),
('EHS Manager', 20000, 1),
('Research Scientist', 10000, 2),
('Research Manager', 20000, 2),
('Process Scientist', 10000, 3),
('Process Manager', 20000, 3),
('Ops Associate', 10000, 4),
('Ops Manager', 20000, 4),
('Salesperson', 10000, 5),
('CEO', 100000, 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES 
('Saurmia', 'Spellaire', 1, 3),
('Marcel', 'Galien', 1, 3),
('Ginadura', 'Belvani', 2, null),
('Fastred', 'Ingmarkesen', 3, 6),
('Neddrir', 'Kjiksen', 3, 6),
('Ekhi', 'Bjadsen', 4, null),
('Ghamorz', 'Grocromgog', 5, 9),
('Arnora', 'Duilis', 5, 9),
('Sulesa', 'Melarg', 6, null),
('Lathon', 'Aldwyr', 7, 12),
('Thalfin', 'Willow', 7, 12),
('Rianis', 'River', 8, null),
('Nanir', 'Barabus', 9, 15),
('Andrana', 'Highbinder', 9, 15),
('Gandela', 'Saram', 10, null);