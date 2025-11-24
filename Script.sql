DROP DATABASE IF EXISTS Checkpoint;
CREATE DATABASE Checkpoint;
USE Checkpoint;

-- =======================================================
-- 1. Tabela de Usuários
-- =======================================================
CREATE TABLE users (
    pk_id INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(100) DEFAULT NULL,
    Nick VARCHAR(50) NOT NULL UNIQUE, -- Aumentado para 50 chars
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    Idade INT DEFAULT NULL,
    Cidade VARCHAR(100) DEFAULT NULL,
    Gostos TEXT DEFAULT NULL,
    Personalidade ENUM('introvertido', 'extrovertido', 'depende da companhia') DEFAULT NULL,
    
    -- "Valor" representa o Teto de Gastos/Salário do usuário
    Valor DECIMAL(10, 2) DEFAULT 0 CHECK (Valor >= 0), 
    
    Disponibilidade TINYINT DEFAULT NULL,
    Preferencia_dia ENUM('domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado') DEFAULT NULL,
    Preferencia_Horario TIME DEFAULT NULL,
    codigo VARCHAR(10) DEFAULT NULL, -- Código de recuperação de senha
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =======================================================
-- 2. Tabela de Eventos (Rolês)
-- =======================================================
CREATE TABLE events (
    pk_idEvento INT AUTO_INCREMENT PRIMARY KEY,
    fk_idUsuario INT NOT NULL,
    nomeEvento VARCHAR(100) NOT NULL,
    dataEvento DATETIME, -- Mudado para DATETIME para aceitar hora se necessário
    localEvento VARCHAR(150),
    QuantParticipantes INT DEFAULT 1,
    
    FOREIGN KEY (fk_idUsuario) REFERENCES users(pk_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =======================================================
-- 3. Tabela de Gastos (Central Financeira)
-- =======================================================
CREATE TABLE gastos (
    pk_idDespesa INT AUTO_INCREMENT PRIMARY KEY,
    fk_idUsuario INT NOT NULL,
    fk_idEvento INT DEFAULT NULL, -- Pode ser NULL se for um gasto avulso (não ligado a evento)
    
    valorGasto DECIMAL(10, 2) NOT NULL CHECK (valorGasto > 0),
    categoria ENUM('alimentação', 'transporte', 'lazer', 'educação', 'saúde', 'roupas', 'moradia', 'eventos', 'outros') DEFAULT 'outros',
    descricao VARCHAR(255) DEFAULT NULL,
    
    dataGasto DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (fk_idUsuario) REFERENCES users(pk_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (fk_idEvento) REFERENCES events(pk_idEvento)
        ON DELETE SET NULL -- Se apagar o evento, mantemos o gasto no histórico
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- [OTIMIZAÇÃO] Índices para deixar a busca do gráfico e saldo rápida
CREATE INDEX idx_usuario_data ON gastos(fk_idUsuario, dataGasto);
CREATE INDEX idx_categoria ON gastos(categoria);

-- =======================================================
-- 4. Tabela de Participações (Muitos para Muitos)
-- =======================================================
CREATE TABLE participacoes (
    fk_idUsuario INT,
    fk_idEvento INT,
    status ENUM('confirmado', 'pendente', 'recusado') DEFAULT 'pendente',
    
    PRIMARY KEY (fk_idUsuario, fk_idEvento),
    FOREIGN KEY (fk_idUsuario) REFERENCES users(pk_id) ON DELETE CASCADE,
    FOREIGN KEY (fk_idEvento) REFERENCES events(pk_idEvento) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =======================================================
-- 5. Tabela de Alertas (Histórico de Status Financeiro)
-- =======================================================
CREATE TABLE alertas (
    pk_idAlerta INT AUTO_INCREMENT PRIMARY KEY,
    fk_idUsuario INT NOT NULL,
    nivel ENUM('Verde', 'Amarelo', 'Vermelho') NOT NULL,
    mensagem TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (fk_idUsuario) REFERENCES users(pk_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =======================================================
-- 6. VIEW para facilitar o Dashboard (DICA DE OURO)
-- =======================================================
-- Essa View calcula automaticamente o total gasto no mês atual para cada usuário.
-- No seu Node.js, você pode fazer: "SELECT * FROM view_resumo_mensal WHERE idUsuario = X"
CREATE OR REPLACE VIEW view_resumo_mensal AS
SELECT 
    u.pk_id AS idUsuario,
    u.Nick,
    u.Valor AS LimiteOrcamento,
    COALESCE(SUM(g.valorGasto), 0) AS TotalGastoMes,
    (u.Valor - COALESCE(SUM(g.valorGasto), 0)) AS SaldoRestante,
    CASE 
        WHEN COALESCE(SUM(g.valorGasto), 0) > u.Valor THEN 'Vermelho'
        WHEN COALESCE(SUM(g.valorGasto), 0) >= (u.Valor * 0.8) THEN 'Amarelo'
        ELSE 'Verde'
    END AS StatusFinanceiro
FROM users u
LEFT JOIN gastos g ON u.pk_id = g.fk_idUsuario 
    AND MONTH(g.dataGasto) = MONTH(CURRENT_DATE()) 
    AND YEAR(g.dataGasto) = YEAR(CURRENT_DATE())
GROUP BY u.pk_id;

select * from gastos