INSERT INTO department (id, name)
VALUES (1, "Engineering & Technology"),
       (2, "Sales, Service & Support"),
       (3, "Marketing & Communications"),
       (4, "Design"),
       (5, "Business Strategy"),
       (6, "Finance"),
       (7, "Legal"),
       (8, "People"),
       (9, "Facilities");

INSERT INTO role (id, title, salary, department_id)
VALUES (1, "Senior Software Engineer", 250000, 1),
       (2, "Student Researcher", 50000, 1),
       (3, "Staff Software Engineer", 190000, 1),
       (4, "Design Engineer", 250000, 4),
       (5, "Data Center Technician", 70000, 9),
       (6, "Team Consultant", 60000, 7),
       (7, "Senior Accountant", 200000, 6),
       (8, "Human Resources", 100000, 8),
       (9, "Sales Manager", 100000, 2),
       (10, "Сhef(cook)", 450000, 9),
       (11, "Strategy Manager", 80000, 5),
       (12, "Engineering Manager", 300000, 1),
       (13, "Facilities Manager", 200000, 9);


INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, "Olivia", "Johnson", 12, NULL),
       (2, "James", "Lee", 13, NULL),
       (3, "James", "Moris", 1, 1),
       (4, "Michael", "Rodriguez", 2, 1),
       (5, "Charlotte", "Clark", 3, 1),
       (6, "Lucas", "Miller", 5, 2), 
       (7, "Ethan", "Taylor", 10, 2),
       (8, "Mia", "Moore", 10, 2),
       (9, "Amelia", "Robinson", 6, NULL),
       (10, "Martin", "Martinez", 8, NULL),
       (11, "William", "Walker", 9, NULL);
