drop database Checkpoint;
CREATE DATABASE IF NOT EXISTS Checkpoint;
	USE Checkpoint;


	-- ==============================
	-- Tabela de Usuários
	-- ==============================
	CREATE TABLE users (
		pk_id INT AUTO_INCREMENT PRIMARY KEY,
		Nome VARCHAR(100) DEFAULT NULL,
		Nick VARCHAR(15) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,	
		senha VARCHAR(255) NOT NULL,
		Idade INT CHECK (Idade < 99) DEFAULT NULL,
		Cidade VARCHAR(100) DEFAULT NULL,
		Gostos TEXT DEFAULT NULL,
		Personalidade ENUM('introvertido', 'extrovertido', 'depende da companhia') DEFAULT NULL,
		Valor DECIMAL(10, 2) DEFAULT 0 CHECK (Valor >= 0) DEFAULT NULL,
		Disponibilidade TINYINT CHECK (Disponibilidade BETWEEN 0 AND 31) DEFAULT NULL,
		Preferencia_dia ENUM('domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado') DEFAULT NULL,
		Preferencia_Horario TIME DEFAULT NULL,
		criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        codigo VARCHAR(10) DEFAULT NULL,
		atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


	/*DELIMITER //
	CREATE TRIGGER valida_nascimento_insert
	BEFORE INSERT ON users
	FOR EACH ROW
	BEGIN
		IF NEW.Nascimento < '1900-01-01' OR NEW.Nascimento > CURDATE() THEN
			SIGNAL SQLSTATE '45000'
				SET MESSAGE_TEXT = 'Data de nascimento inválida: deve ser entre 1900-01-01 e a data atual.';
		END IF;
	END //
	DELIMITER ;

	DELIMITER //
	CREATE TRIGGER valida_nascimento_update
	BEFORE UPDATE ON users
	FOR EACH ROW
	BEGIN
		IF NEW.Nascimento < '1900-01-01' OR NEW.Nascimento > CURDATE() THEN
			SIGNAL SQLSTATE '45000'
				SET MESSAGE_TEXT = 'Data de nascimento inválida: deve ser entre 1900-01-01 e a data atual.';
		END IF;
	END //
	DELIMITER ;*/

-- ==============================
	-- Tabela de Eventos
	-- ==============================
	CREATE TABLE events (
		pk_idEvento INT AUTO_INCREMENT PRIMARY KEY,
        fk_idUsuario INT,
		nomeEvento VARCHAR(50) NOT NULL,
		dataEvento DATE,
		localEvento VARCHAR(100),
		QuantParticipantes INT,
        FOREIGN KEY (fk_idUsuario) REFERENCES users(pk_id)
			ON DELETE CASCADE
			ON UPDATE CASCADE
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

	-- ==============================
	-- Tabela de Gastos
	-- ==============================
	CREATE TABLE gastos (
		pk_idDespesa INT AUTO_INCREMENT PRIMARY KEY,
		fk_idUsuario INT,
        fk_idEvento INT,
		valorGasto DECIMAL(10, 2) CHECK (valorGasto >= 0),
		categoria ENUM('alimentação', 'transporte', 'lazer', 'educação', 'saúde', 'outros', 'roupas', 'moradia','eventos'),
		FOREIGN KEY (fk_idUsuario) REFERENCES users(pk_id)
			ON DELETE CASCADE
			ON UPDATE CASCADE,
		FOREIGN KEY (fk_idEvento) REFERENCES events(pk_idEvento)
			ON DELETE CASCADE
            ON UPDATE CASCADE
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

	CREATE INDEX idx_categoria ON gastos(categoria);

	-- ==============================
	-- Tabela de Participações
	-- ==============================
	CREATE TABLE participacoes (
		fk_idUsuario INT,
		fk_idEvento INT,
		PRIMARY KEY (fk_idUsuario, fk_idEvento),
		FOREIGN KEY (fk_idUsuario) REFERENCES users(pk_id)
			ON DELETE CASCADE
			ON UPDATE CASCADE,
		FOREIGN KEY (fk_idEvento) REFERENCES events(pk_idEvento)
			ON DELETE CASCADE
			ON UPDATE CASCADE
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


	-- ==============================
	-- Tabela de Relatórios
	-- ==============================
	CREATE TABLE relatorios (
		pk_idRelatorio INT AUTO_INCREMENT PRIMARY KEY,
		fk_idUsuario INT NOT NULL,
		fk_idEvento INT,
		totalGasto DECIMAL(10,2),
		maiorDespesa DECIMAL(10,2),
		categoriaMaisUsada ENUM('alimentação', 'transporte', 'lazer', 'educação', 'saúde', 'outros', 'roupas', 'moradia'),
		observacoes TEXT,
		nivel_financeiro ENUM('Verde', 'Amarelo', 'Vermelho'),
		dataGeracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (fk_idUsuario) REFERENCES users(pk_id)
			ON DELETE CASCADE
			ON UPDATE CASCADE,
		FOREIGN KEY (fk_idEvento) REFERENCES events(pk_idEvento)
			ON DELETE SET NULL
			ON UPDATE CASCADE
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

	CREATE INDEX idx_relatorio_usuario_evento ON relatorios(fk_idUsuario, fk_idEvento);
	CREATE INDEX idx_fk_usuario ON gastos(fk_idUsuario);
	CREATE INDEX idx_fk_evento ON participacoes(fk_idEvento);

	-- ==============================
	-- Tabela de Alertas
	-- ==============================
	CREATE TABLE alertas (
		pk_idAlerta INT AUTO_INCREMENT PRIMARY KEY,
		fk_idUsuario INT NOT NULL,
		nivel ENUM('Verde', 'Amarelo', 'Vermelho') NOT NULL,
		mensagem TEXT,
		criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (fk_idUsuario) REFERENCES users(pk_id)
			ON DELETE CASCADE
			ON UPDATE CASCADE
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


	-- ==============================
	-- Trigger de Alerta Financeiro 
	-- ==============================
	DELIMITER //
	CREATE TRIGGER trig_alerta_financeiro_insert
	AFTER INSERT ON gastos
	FOR EACH ROW
	BEGIN
		DECLARE total DECIMAL(10,2);
		DECLARE limite DECIMAL(10,2);
		DECLARE nivelAtual ENUM('Verde', 'Amarelo', 'Vermelho');

		SELECT SUM(valorGasto) INTO total
		FROM gastos
		WHERE fk_idUsuario = NEW.fk_idUsuario;

		SELECT Valor INTO limite
		FROM users
		WHERE pk_id = NEW.fk_idUsuario;

		IF limite IS NULL OR limite = 0 THEN
			SET limite = 1; 
		END IF;

		SELECT nivel INTO nivelAtual
		FROM alertas
		WHERE fk_idUsuario = NEW.fk_idUsuario
		ORDER BY criado_em DESC
		LIMIT 1;

		IF total < (0.3 * limite) AND nivelAtual <> 'Verde' THEN
			INSERT INTO alertas (fk_idUsuario, nivel, mensagem)
			VALUES (NEW.fk_idUsuario, 'Verde', 'Gastos sob controle.');
		ELSEIF total < (0.5 * limite) AND nivelAtual <> 'Amarelo' THEN
			INSERT INTO alertas (fk_idUsuario, nivel, mensagem)
			VALUES (NEW.fk_idUsuario, 'Amarelo', 'Atenção: 50% do limite atingido.');
		ELSEIF total >= (0.5 * limite) AND nivelAtual <> 'Vermelho' THEN
			INSERT INTO alertas (fk_idUsuario, nivel, mensagem)
			VALUES (NEW.fk_idUsuario, 'Vermelho', 'Cuidado! Gastos altos.');
		END IF;

	END //
	DELIMITER ;
    select * from events;

    


