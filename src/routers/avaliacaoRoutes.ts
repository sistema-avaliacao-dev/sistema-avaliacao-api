import { Router } from "express";
import AvaliacaoController from "../controllers/AvaliacaoController";
import AvaliacaoRespostaController from "../controllers/AvaliacaoRespostaController";
import Auth from "../middlewares/Auth";

export const avaliacaoRoutes = Router();

avaliacaoRoutes.post('/', Auth.checkToken, Auth.isAdmin, AvaliacaoController.create)
avaliacaoRoutes.get('/', Auth.checkToken, AvaliacaoController.get)

avaliacaoRoutes.get('/subcomissao', Auth.checkToken, AvaliacaoController.getBySubcomissao)
avaliacaoRoutes.get('/comissao', Auth.checkToken, AvaliacaoController.getByComissao)

avaliacaoRoutes.post('/resposta', Auth.checkToken, Auth.isServidor, AvaliacaoRespostaController.create)
avaliacaoRoutes.get('/resposta', Auth.checkToken, AvaliacaoRespostaController.get)