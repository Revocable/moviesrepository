<?php

require_once(__DIR__ . "/../config/Conexao.php");

class Usuario
{


    public static function add($login, $senha, $nome)
    {
        try {
            $senhaCripto = password_hash($senha, PASSWORD_BCRYPT);

            $conexao = Conexao::getConexao();
            $stmt = $conexao->prepare("INSERT INTO usuario (email, senha, nome) VALUES (?,?,?)");
            $stmt->execute([$login, $senhaCripto, $nome]);

            return $stmt->rowCount() === 1;
        } catch (Exception $e) {
            return false;
        }
    }
    public static function exist($id)
    {
        try {
            $conexao = Conexao::getConexao();
            $stmt = $conexao->prepare("SELECT COUNT(*) FROM usuario WHERE id = ?");
            $stmt->execute([$id]);

            return $stmt->fetchColumn();
        } catch (Exception $e) {
            return null;
        }
    }
    public static function existLogin($login)
    {
        try {
            $conexao = Conexao::getConexao();
            $stmt = $conexao->prepare("SELECT COUNT(*) FROM usuario WHERE email LIKE ?");
            $stmt->execute([$login]);

            return $stmt->fetchColumn();
        } catch (Exception $e) {
            return null;
        }
    }
    public static function getLogin($login, $senha)
    {
        try {
            $conexao = Conexao::getConexao();
            $stmt = $conexao->prepare("SELECT * FROM usuario WHERE email LIKE ?");
            $stmt->execute([$login]);

            $usuario = $stmt->fetchAll()[0];

            if (password_verify($senha, $usuario["senha"])) {
                return $usuario;
            } else {
                return false;
            }
        } catch (Exception $e) {
            return null;
        }
    }
    public static function adicionarFavorito($idUsuario, $idFilme)
    {
        try {
            $conexao = Conexao::getConexao();

            if (!self::exist($idUsuario) || !Filme::existeFilme($idFilme)) {
                throw new Exception("Usuário ou filme não existe", 400);
            }

            $stmt = $conexao->prepare("INSERT INTO Favoritos (id_usuario, id_filme) VALUES (?, ?)");
            $stmt->execute([$idUsuario, $idFilme]);

            return $stmt->rowCount() === 1; 
        } catch (Exception $e) {
            return false; 
        }
    }

    public static function removerFavorito($idUsuario, $idFilme)
    {
        try {
            $conexao = Conexao::getConexao();

            if (!self::exist($idUsuario) || !Filme::existeFilme($idFilme)) {
                throw new Exception("Usuário ou filme não existe", 400);
            }

            $stmt = $conexao->prepare("DELETE FROM Favoritos WHERE id_usuario = ? AND id_filme = ?");
            $stmt->execute([$idUsuario, $idFilme]);

            return $stmt->rowCount() === 1;
        } catch (Exception $e) {
            return false;
        }
    }

    public static function obterInfoFavorito($idUsuario, $idFilme)
    {
        try {
            $conexao = Conexao::getConexao();

            if (!self::exist($idUsuario) || !Filme::existeFilme($idFilme)) {
                throw new Exception("Usuário ou filme não existe", 400);
            }

            $stmt = $conexao->prepare("
            SELECT Usuario.nome AS nomeUsuario, Filme.nome AS nomeFilme
            FROM Favoritos
            INNER JOIN Usuario ON Favoritos.id_usuario = Usuario.id
            INNER JOIN Filme ON Favoritos.id_filme = Filme.id
            WHERE Favoritos.id_usuario = ? AND Favoritos.id_filme = ?
        ");
            $stmt->execute([$idUsuario, $idFilme]);

            $favoritoInfo = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$favoritoInfo) {
                throw new Exception("Favorito não encontrado", 404);
            }

            return json_encode($favoritoInfo);
        } catch (Exception $e) {
            return json_encode(["error" => $e->getMessage()]);
        }
    }

    public static function obterFilmesFavoritos($idUsuario)
    {
        try {
            $conexao = Conexao::getConexao();

            $sql = "SELECT Filme.titulo, Filme.diretor, Filme.ano_lancamento, Filme.genero,Filme.id
                FROM Favoritos
                INNER JOIN Filme ON Favoritos.id_filme = Filme.id
                WHERE Favoritos.id_usuario = ?";

            $stmt = $conexao->prepare($sql);
            $stmt->execute([$idUsuario]);

            $favoritos = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return (object) $favoritos;
        } catch (Exception $e) {
            return [];
        }
    }



}