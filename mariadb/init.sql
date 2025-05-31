CREATE DATABASE IF NOT EXISTS sistema_de_votacao_api;
USE sistema_de_votacao_api;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Enquetes
CREATE TABLE polls (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CHECK (end_date > start_date)
);

CREATE TABLE options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    text VARCHAR(255) NOT NULL,
    poll_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE
);

CREATE TABLE votes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    poll_id INT NOT NULL,
    option_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE,
    FOREIGN KEY (option_id) REFERENCES options(id) ON DELETE CASCADE,
    UNIQUE KEY unique_vote (user_id, poll_id) -- Garante 1 voto por usuário por enquete
);

INSERT INTO users (email, password) VALUES 
('user1@example.com', '$2b$10$zmfBpOx.plmggjAw2K.3quK38oZg7exKx7MI8KHNi7xCLnXyZXeKa'),
('user2@example.com', '$2b$10$zmfBpOx.plmggjAw2K.3quK38oZg7exKx7MI8KHNi7xCLnXyZXeKa'),
('user3@example.com', '$2b$10$zmfBpOx.plmggjAw2K.3quK38oZg7exKx7MI8KHNi7xCLnXyZXeKa');

INSERT INTO polls (title, start_date, end_date, user_id) VALUES 
('Qual seu framework favorito?', '2023-01-01 00:00:00', '2023-12-31 23:59:59', 1),
('Qual linguagem você prefere?', '2023-02-01 00:00:00', '2023-12-31 23:59:59', 2),
('Qual IDE você usa?', '2023-03-01 00:00:00', '2023-12-31 23:59:59', 1);

INSERT INTO options (text, poll_id) VALUES 
('React', 1),
('Vue', 1),
('Angular', 1),
('JavaScript', 2),
('TypeScript', 2),
('Python', 2),
('VSCode', 3),
('IntelliJ', 3);
