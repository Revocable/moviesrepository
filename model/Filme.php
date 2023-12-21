<?php

require_once(__DIR__ . "/../config/Conexao.php");

class Filme
{
    public static function addFilme($titulo, $diretor, $anoLancamento, $genero)
    {
        try {
            $conexao = Conexao::getConexao();
            $stmt = $conexao->prepare("INSERT INTO Filme(titulo, diretor, ano_lancamento, genero) VALUES (?, ?, ?, ?)");
            $stmt->execute([$titulo, $diretor, $anoLancamento, $genero]);

            if ($stmt->rowCount() > 0) {
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            echo $e->getMessage();
            exit;
        }
    }

    public static function getFilmePorTitulo($titulo)
    {
        try {
            $conexao = Conexao::getConexao();
            $stmt = $conexao->prepare("SELECT * FROM Filme WHERE titulo = ?");
            $stmt->execute([$titulo]);

            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            echo $e->getMessage();
            return null;
        }
    }

    public static function deletarFilme($id)
    {
        try {
            $conexao = Conexao::getConexao();
            $conexao->exec("SET foreign_key_checks = 0");
            $stmtDeleteRelacionados = $conexao->prepare("DELETE FROM favoritos WHERE id_filme = ?");
            $stmtDeleteRelacionados->execute([$id]);
            $conexao->exec("SET foreign_key_checks = 1");
            $stmtFilme = $conexao->prepare("DELETE FROM Filme WHERE id = ?");
            $stmtFilme->execute([$id]);
            if ($stmtFilme->rowCount() > 0) {
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            throw new Exception("Erro ao excluir Filme: " . $e->getMessage());
        }
    }
    
    public static function atualizarFilme($id, $titulo, $diretor, $anoLancamento, $genero)
    {
        try {
            $conexao = Conexao::getConexao();
            $stmt = $conexao->prepare("UPDATE Filme SET titulo = ?, diretor = ?, ano_lancamento = ?, genero = ? WHERE id = ?");
            $stmt->execute([$titulo, $diretor, $anoLancamento, $genero, $id]);

            if ($stmt->rowCount() > 0) {
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            echo $e->getMessage();
            return false;
        }
    }

    public static function deletarPorGenero($genero)
    {
        try {
            $conexao = Conexao::getConexao();
            $stmt = $conexao->prepare("DELETE FROM Filme WHERE genero = ?");
            $stmt->execute([$genero]);

            if ($stmt->rowCount() > 0) {
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            echo $e->getMessage();
            exit;
        }
    }
    public static function listarFilmes()
    {
        try {
            $conexao = Conexao::getConexao();
            $stmt = $conexao->prepare("SELECT * FROM Filme ORDER BY id");
            $stmt->execute();

            $filmes = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return (object) $filmes;
        } catch (Exception $e) {
            echo $e->getMessage();
            exit;
        }
    }
    
    public static function existeFilme($id)
    {
        try {
            $conexao = Conexao::getConexao();
            $stmt = $conexao->prepare("SELECT COUNT(*) FROM Filme WHERE id = ?");
            $stmt->execute([$id]);

            if ($stmt->fetchColumn() > 0) {
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            echo $e->getMessage();
            exit;
        }
    }

    public static function getFilmePorId($id)
    {
        try {
            $conexao = Conexao::getConexao();
            $stmt = $conexao->prepare("SELECT * FROM Filme WHERE id = ?");
            $stmt->execute([$id]);

            $resultados = $stmt->fetchAll();

            if (count($resultados) > 0) {
                return $resultados[0];
            } else {
                return false;
            }
        } catch (Exception $e) {
            echo $e->getMessage();
            exit;
        }
    }


}

?>
