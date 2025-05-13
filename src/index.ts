import express, { json, Request, Response, urlencoded } from 'express'
import cors from "cors"
import sequelize from './database/db'
import { userRoutes } from './routers/userRoutes'
import { authRoutes } from './routers/authRoutes'
import email from './services/email'
import Auth from './middlewares/Auth'
import { servidorRoutes } from './routers/servidorRoutes'
import { avaliacaoRoutes } from './routers/avaliacaoRoutes'
import ParecerConclusivoService from './services/ParecerConclusivoService'
import User from './database/models/User'
import passwordHash from './utils/passwordHash'
import { cargoRoutes } from './routers/cargoRoutes'
import subcomissaoRoutes from './routers/subcomissaoRoutes'
import comissaoRoutes from './routers/comissaoRoutes'
import Servidor from './database/models/Servidor'
import Cargo from './database/models/Cargos'

const app = express()
const port = process.env.PORT || 8080

// Configuração do CORS
const corsOptions = {
  origin: [
    'http://localhost:3000', // Desenvolvimento local
    process.env.FRONTEND_URL, // URL do frontend em produção
  ].filter(Boolean), // Remove valores undefined/null
  credentials: true, // Permite cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // Cache das opções de preflight por 24 horas
};

app.use(cors(corsOptions))
app.use(json())
app.use(urlencoded({ extended: true }))

app.use("/user", userRoutes)
app.use("/auth", authRoutes)
app.use("/servidor", servidorRoutes)
app.use("/cargo", cargoRoutes)
app.use("/subcomissao", subcomissaoRoutes)
app.use("/comissao", comissaoRoutes)
app.use("/avaliacao", avaliacaoRoutes)

app.listen(port, async () => {
    try {
                // await Cargo.create({nome: "AUXILIAR ADMINISTRATIVO", nivel: 'medio'})
                // await Cargo.create({nome: "AJUDANTE DE SANEAMENTO", nivel: 'fundamental'})
                // await Cargo.create({nome: "TÉCNICO OPERACIONAL ETA/ETE", nivel: 'medio'})
                // await Cargo.create({nome: "TECNICO EM SERGURANCA DO TRABALHO", nivel: 'medio'})
                // await Cargo.create({nome: "TÉCNICO EM ELETROMECÂNICA", nivel: 'medio'})
                // await Cargo.create({nome: "TÉCNICO DEM EDIFICAÇÕES", nivel: 'medio'})
                // await Cargo.create({nome: "QUÍMICO", nivel: 'superior'})
                // await Cargo.create({nome: "PEDREIRO", nivel: 'fundamental'})
                // await Cargo.create({nome: "OPERADOR DE MAQUINA PESADA", nivel: 'fundamental'})
                // await Cargo.create({nome: "MOTORISTA", nivel: 'fundamental'})
                // await Cargo.create({nome: "FISCAL", nivel: 'medio'})
                // await Cargo.create({nome: "ENGENHEIRO CIVIL", nivel: 'superior'})
                // await Cargo.create({nome: "ENCANADOR", nivel: 'fundamental'})
                // await Cargo.create({nome: "BIÓLOGO", nivel: 'superior'})
                // await Cargo.create({nome: "AGENTE ADMINISTRATIVO", nivel: 'medio'})

                // const password_hash = await passwordHash('admin@2025');
                // await User.create({
                //     username: 'admin',
                //     password_hash,
                //     role: 'admin'
                // })

        return console.log(`Server e database rodando na porta ${port}`)
    } catch (e) {
        return console.log('Erro no servidor: ' + e)
    }

})