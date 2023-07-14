SELECT
t1.id,
t1.first_name,
t1.last_name,
role.title,
department.department_name,
role.salary,
(CASE
WHEN t1.manager_id IS NULL THEN 'null'
ELSE CONCAT(t2.first_name, " ",t2.last_name)
END) as manager
FROM employee t1
JOIN employee t2 ON t1.manager_id = t2.id OR (t1.id = t2.id AND (t1.manager_id IS NULL)) 
JOIN role ON t1.role_id = role.id
JOIN department ON role.department_id = department.id;