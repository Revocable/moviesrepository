<?php

session_start();

require_once "./config/utils.php";
require_once "./config/verbs.php";
require_once "./config/header.php";
require_once "./model/Usuario.php";
require_once "./model/Filme.php";
$usuario = idUsuarioLogado();

if (isMetodo("GET")) {
    try {
        if (parametrosValidos($_GET, ["logout"])) {
            if (!$usuario) {
                throw new Exception("Usuário não está logado", 401);
            }
            session_destroy();
            output(200, ["msg" => "Deslogado com sucesso"]);
        }
        if (parametrosValidos($_GET, ["obterFilmesFavoritos"])) {
            

            if (!Usuario::exist($usuario)) {
                throw new Exception("Usuário não existe", 400);
            }
            $filmesFavoritos = Usuario::obterFilmesFavoritos($usuario);

            output(200, ["filmesFavoritos" => $filmesFavoritos]);
        }

        if (!$usuario) {
            throw new Exception("Usuário não está logado", 401);
        }
        if (!Usuario::exist($usuario)) {
            session_destroy();
            throw new Exception("Usuário não existe mais. Você foi automaticamente deslogado", 400);
        }
        output(200, ["msg" => "Olá! Parece que tá tudo OK! $usuario"]);
    } catch (Exception $e) {
        output($e->getCode(), ["msg" => $e->getMessage()]);
    }
}

if (isMetodo("DELETE")) {
    try {
        if (!$usuario) {
            throw new Exception("Você precisa estar logado para remover um Favorito", 401);
        }

        // Certifique-se de que os parâmetros necessários estão presentes na solicitação
        if (!parametrosValidos($_GET, ["removerFavorito"])) {
            throw new Exception("Parâmetros inválidos para remover Favorito", 400);
        }
        $idFilme = $_GET["removerFavorito"];

        // Verifique se o usuário existe
        if (!Usuario::exist($usuario)) {
            throw new Exception("Usuário não encontrado", 404);
        }

        // Verifique se o filme existe
        if (!Filme::existeFilme($idFilme)) {
            throw new Exception("Filme não encontrado", 404);
        }

        // Chame o método para remover o favorito
        $removerFavorito = Usuario::removerFavorito($usuario, $idFilme);

        // Verifique se a remoção do favorito foi bem-sucedida
        if ($removerFavorito) {
            output(200, ["msg" => "Favorito removido com sucesso"]);
        } else {
            throw new Exception("Erro ao remover Favorito", 500);
        }
    } catch (Exception $e) {
        output($e->getCode(), ["msg" => $e->getMessage()]);
    }
}



if (isMetodo("POST")) {
    try {
        if (parametrosValidos($_POST, ["adicionarFavorito", "idFilme"])) {
            if (!$usuario) {
                throw new Exception("Você não esta logado e não pode fazer isso", 400);
            }

            $idFilme = $_POST["idFilme"];

            if (!Filme::existeFilme($idFilme)) {
                throw new Exception("Filme não existe", 400);
            }

            $res = Usuario::adicionarFavorito($usuario, $idFilme);
            if (!$res) {
                throw new Exception("Erro ao adicionar filme aos favoritos", 500);
            }
            output(200, ["msg" => "Filme adicionado aos favoritos com sucesso"]);
        }

        
        if(parametrosValidos($_POST,["removerFavorito","idFilme"])){
            if (!$usuario) {
                throw new Exception("Você não esta logado e não pode fazer isso", 400);
            }

            $idFilme = $_POST["idFilme"];
            
            if (!Filme::existeFilme($idFilme)) {
                throw new Exception("Filme não existe", 400);
            }
            $res = Usuario::removerFavorito($usuario, $idFilme);
            if (!$res) {
                throw new Exception("Erro ao remover filme aos favoritos", 500);
            }
            output(200, ["msg" => "Filme removido aos favoritos com sucesso"]);


        }
        
        $usuario = idUsuarioLogado();

        if (parametrosValidos($_POST, ["signup", "login", "nome", "senha"])) {
            if (Usuario::existLogin($_POST["login"])) {
                throw new Exception("Este login já existe", 400);
            }

            $res = Usuario::add($_POST["login"], $_POST["senha"], $_POST["nome"]);
            if (!$res) {
                throw new Exception("Erro no cadastro", 500);
            }
            output(200, ["msg" => "Cadastro realizado com sucesso"]);
        }

        if (parametrosValidos($_POST, ["login", "senha"])) {
            if ($usuario) {
                throw new Exception("Você está logado e não pode fazer isso", 400);
            }

            if (!Usuario::existLogin($_POST["login"])) {
                throw new Exception("Este login não existe", 400);
            }

            $res = Usuario::getLogin($_POST["login"], $_POST["senha"]);
            if (!$res) {
                throw new Exception("Login ou senha inválida", 400);
            }
            setIdUsuarioLogado($res["id"]);
            output(200, ["msg" => "Login realizado com sucesso"]);
        }



        throw new Exception("Requisição não reconhecida", 400);
    } catch (Exception $e) {
        output($e->getCode(), ["msg" => $e->getMessage()]);
    }
} else {
    output(405, ["msg" => "Método não permitido"]);
}
