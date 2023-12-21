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
        if (parametrosValidos($_GET, ["id"])) {
            $filmeId = $_GET["id"];
            $filme = Filme::getFilmePorId($filmeId);

            if (!$filme) {
                output(404, ["msg" => "Filme não encontrado"]);
            }

            output(200, $filme);
        } else {
            $filmes = Filme::listarFilmes();
            output(200, $filmes);
        }
    } catch (Exception $e) {
        output($e->getCode(), ["msg" => $e->getMessage()]);
    }


}

if (isMetodo("POST")) {
    try {
        if (!parametrosValidos($_POST, ["titulo", "diretor", "anoLancamento", "genero"])) {
            throw new Exception("Parâmetros inválidos para criar um Filme", 400);
        }

        if (!$usuario) {
            throw new Exception("Você precisa estar logado para adicionar um Filme", 401);
        }
        $res = Filme::addFilme($_POST["titulo"], $_POST["diretor"], $_POST["anoLancamento"], $_POST["genero"]);
        if (!$res) {
            throw new Exception("Erro ao adicionar Filme", 500);
        }

        output(200, ["msg" => "Filme adicionado com sucesso"]);
    } catch (Exception $e) {
        output($e->getCode(), ["msg" => $e->getMessage()]);
    }

    
}

if (isMetodo("PUT")) {
    try {
        if (!$usuario) {
            throw new Exception("Você precisa estar logado para atualizar um Filme", 401);
        }

        parse_str(file_get_contents("php://input"), $_PUT);

        if (!isset($_PUT["id"]) || !parametrosValidos($_PUT, ["id"])) {
            throw new Exception("ID do Filme inválido", 400);
        }

        $filmeId = $_PUT["id"];

        if (!Filme::existeFilme($filmeId)) {
            throw new Exception("Filme não encontrado", 404);
        }

        $res = Filme::atualizarFilme($filmeId, $_PUT["titulo"], $_PUT["diretor"], $_PUT["anoLancamento"], $_PUT["genero"]);
        if (!$res) {
            throw new Exception("Erro ao atualizar Filme", 500);
        }

        output(200, ["msg" => "Filme atualizado com sucesso"]);
    } catch (Exception $e) {
        output($e->getCode(), ["msg" => $e->getMessage()]);
    }
}

if (isMetodo("DELETE")) {
    try {
        if (!$usuario) {
            throw new Exception("Você precisa estar logado para excluir um Filme", 401);
        }

        if (!parametrosValidos($_GET, ["id"])) {
            throw new Exception("ID do Filme inválido", 400);
        }

        $filmeId = $_GET["id"];

        if (!Filme::existeFilme($filmeId)) {
            throw new Exception("Filme não encontrado", 404);
        }

        $res = Filme::deletarFilme($filmeId);
        if (!$res) {
            throw new Exception("Erro ao excluir Filme", 500);
        }

        output(200, ["msg" => "Filme excluído com sucesso"]);
    } catch (Exception $e) {
        output($e->getCode(), ["msg" => $e->getMessage()]);
    }
}
