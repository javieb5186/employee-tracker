SELECT 
role.id,
role.title,
department.department_name as department,
role.salary
FROM role
JOIN department ON role.department_id = department.id;