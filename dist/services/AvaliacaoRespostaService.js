"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../database/db"));
const HttpError_1 = __importDefault(require("../utils/HttpError"));
const Avaliacao_1 = __importDefault(require("../database/models/Avaliacao"));
const AvaliacaoResposta_1 = __importDefault(require("../database/models/AvaliacaoResposta"));
const tiposAvaliacaoResposta_1 = require("../utils/tiposAvaliacaoResposta");
const ParecerConclusivoService_1 = __importDefault(require("./ParecerConclusivoService"));
const Servidor_1 = __importDefault(require("../database/models/Servidor"));
const Cargos_1 = __importDefault(require("../database/models/Cargos"));
exports.default = new class AvaliacaoRespostaService {
    create(avaliacao_id, tipo, respostas) {
        return __awaiter(this, void 0, void 0, function* () {
            let transaction;
            try {
                transaction = yield db_1.default.transaction();
                yield this.validate({ avaliacao_id, tipo, respostas, is_create: true });
                const avaliacao = yield Avaliacao_1.default.findOne({ where: { id: avaliacao_id } });
                if (tipo == 'parecer_conclusivo') {
                    const data_atual = new Date();
                    yield avaliacao.update({ data_fim: data_atual, status: 'finalizada' }, { transaction });
                    yield ParecerConclusivoService_1.default.update(avaliacao_id, respostas, transaction);
                }
                else {
                    const avaliacao_resposta = yield AvaliacaoResposta_1.default.create(Object.assign({ avaliacoes_id: avaliacao_id, tipo }, respostas), { transaction });
                    let proximo_tipo = '';
                    tiposAvaliacaoResposta_1.tiposAvalicaoResposta.map((tipo_modelo, index) => {
                        if (tipo_modelo == tipo) {
                            proximo_tipo = tiposAvaliacaoResposta_1.tiposAvalicaoResposta[index + 1];
                        }
                    });
                    if (proximo_tipo == 'parecer_conclusivo') {
                        yield ParecerConclusivoService_1.default.create(avaliacao_id, avaliacao_resposta, transaction);
                    }
                    yield avaliacao.update({ status: proximo_tipo }, { transaction });
                }
                yield transaction.commit();
            }
            catch (e) {
                if (transaction) {
                    yield transaction.rollback();
                }
                if (e) {
                    if (e instanceof HttpError_1.default)
                        throw e;
                    throw new HttpError_1.default(500, e.message);
                }
            }
        });
    }
    get(avaliacao_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.validate({ avaliacao_id });
                const respostas = yield AvaliacaoResposta_1.default.findAll({ where: { avaliacoes_id: avaliacao_id } });
                const parecer_conclusivo = yield ParecerConclusivoService_1.default.get(avaliacao_id);
                return Object.assign(Object.assign({}, respostas), { parecer_conclusivo });
            }
            catch (e) {
                if (e) {
                    if (e instanceof HttpError_1.default)
                        throw e;
                    throw new HttpError_1.default(500, e.message);
                }
            }
        });
    }
    validate(_a) {
        return __awaiter(this, arguments, void 0, function* ({ avaliacao_id, tipo, respostas, is_create }) {
            if (!avaliacao_id) {
                throw new HttpError_1.default(400, 'Avaliação não enviada, selecione uma avaliação antes de responde-la');
            }
            const avaliacao = yield Avaliacao_1.default.findOne({ where: { id: avaliacao_id } });
            if (!avaliacao) {
                throw new HttpError_1.default(404, 'Avaliação não encontrada, selecione uma avaliação válida');
            }
            if (is_create) {
                if (avaliacao.data_fim) {
                    throw new HttpError_1.default(400, 'Avaliação já foi finalizada, selecione uma avaliação em andamento');
                }
                if (!tipo) {
                    throw new HttpError_1.default(400, 'Tipo de avaliação não enviado, envie o tipo da avaliação antes de responde-la');
                }
                if (!tiposAvaliacaoResposta_1.tiposAvalicaoResposta.includes(tipo)) {
                    throw new HttpError_1.default(404, 'Tipo de avaliação não encontrado, selecione um tipo de avaliação válido');
                }
                if (tipo != avaliacao.status) {
                    throw new HttpError_1.default(404, `A avaliação possui o seguinte status: ${avaliacao.status} `);
                }
                if (tipo !== 'parecer_conclusivo') {
                    if (!respostas || Object.values(respostas).length == 0 || Object.values(respostas).length < 16) {
                        throw new HttpError_1.default(400, 'Respostas não enviadas, envie todas as respostas da avaliação para responde-la');
                    }
                    const servidor = yield Servidor_1.default.findOne({ where: { id: avaliacao.servidores_id } });
                    const cargo = yield Cargos_1.default.findOne({ where: { id: servidor.cargo_id } });
                    switch (cargo.nome) {
                        case "SUPERIOR":
                            if (Object.values(respostas).length != 19) {
                                throw new HttpError_1.default(400, 'Envie todas as 20 respostas para responder o formulário.');
                            }
                            break;
                        case "MEDIO":
                            if (Object.values(respostas).length != 18) {
                                throw new HttpError_1.default(400, 'Envie todas as 19 respostas para responder o formulário.');
                            }
                            break;
                        case "FUNDAMENTAL":
                            if (Object.values(respostas).length != 16) {
                                throw new HttpError_1.default(400, 'Envie todas as 19 respostas para responder o formulário.');
                            }
                            break;
                    }
                }
                if (tipo == 'parecer_conclusivo') {
                    if (Object.values(respostas).length == 0) {
                        throw new HttpError_1.default(400, 'Respostas não enviadas, envie todas as respostas da avaliação para responde-la');
                    }
                    if (respostas.atividade_complexa === undefined || respostas.atividade_complexa === null) {
                        throw new HttpError_1.default(400, 'Selecione se a atividade é complexa');
                    }
                    if (respostas.conclusao_apto === undefined || respostas.conclusao_apto === null) {
                        throw new HttpError_1.default(400, 'Selecione se o servidor está apto');
                    }
                }
            }
        });
    }
};
//# sourceMappingURL=AvaliacaoRespostaService.js.map