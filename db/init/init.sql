CREATE TABLE IF NOT EXISTS nodes (
    -- id узла
    id serial PRIMARY KEY,
    -- id родительского узла
    parent_id integer REFERENCES nodes(id) ON DELETE CASCADE,
    -- имя узла
    name varchar(80) NOT NULL,
    -- IP-адрес узла
    ip varchar(15) NOT NULL,
    -- номер порта узла
    port integer CHECK (
      port >= 0
      AND port <= 65535
    ) NOT NULL,
    -- Уникальное ограничение для столбцов (name, ip, port) 
    CONSTRAINT unique_name_ip_port UNIQUE (name, ip, port)
  );

  -- Первоначальные данные
  INSERT INTO
    nodes( parent_id, name, ip, port)
  VALUES
    ( NULL, 'Шлюз портала', '1.1.1.1', 5000 ),
    ( 1, 'center.inobitec (nginx)', '2.2.2.2', 3000 ),
    ( 1, 'ural.inobitec (nginx)', '3.3.3.3', 3000 ),
    ( 1, 'far-east.inobitec (nginx)', '4.4.4.4', 3000 ),
    ( 2, 'control node 1', '163.127.249.250', 53682 ),
    ( 5, 'storage node 1', '9.207.38.141', 11953 ),
    ( 2, 'control node 2', '2.193.157.139', 9300 ),
    ( 7, 'storage node 1', '236.36.91.217', 24459 ),
    ( 7, 'storage node 2', '17.28.223.10', 57420 ),
    ( 2, 'control node 3', '101.170.188.47', 8598 ),
    ( 10, 'storage node 1', '177.249.36.175', 58962 ),
    ( 11, 'info node 1', '217.96.129.42', 17375 ),
    ( 3, 'control node 1', '179.181.190.211', 17375 ),
    ( 13, 'storage node 1', '10.85.197.71', 28750 ),
    ( 13, 'node js server 1', '241.181.31.26', 3479 ),
    ( 13, 'node js server 2', '202.122.107.133', 56872 ),
    ( 3, 'control node 2', '191.255.23.30', 29297 ),
    ( 4, 'control node 1', '53.30.238.192', 26314 ),
    ( 18, 'storage node', '170.15.137.223', 6132 ),
    ( 18, 'node js server 1', '83.163.255.216', 56852 ),
    ( 4, 'control node 2', '36.234.155.45', 40111 );