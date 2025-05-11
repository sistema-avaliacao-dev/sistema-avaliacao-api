import { Optional } from "sequelize";
import {
    Table,
    Model,
    Column,
    DataType
} from "sequelize-typescript";

export interface ParecerConclusivoAttributes {
    id?: number
    avaliacao_id: number
    criterio_1_distribuido: number
    criterio_1_obtido: number
    criterio_2_distribuido: number
    criterio_2_obtido: number
    criterio_3_distribuido: number
    criterio_3_obtido: number
    criterio_4_distribuido: number
    criterio_4_obtido: number
    criterio_5_distribuido: number
    criterio_5_obtido: number
    criterio_6_distribuido: number
    criterio_6_obtido: number
    criterio_7_distribuido: number
    criterio_7_obtido: number
    criterio_8_distribuido: number
    criterio_8_obtido: number
    criterio_9_distribuido: number
    criterio_9_obtido: number
    criterio_10_distribuido: number
    criterio_10_obtido: number
    criterio_11_distribuido: number
    criterio_11_obtido: number
    criterio_12_distribuido: number
    criterio_12_obtido: number
    total_distribuido: number
    total_obtido: number
    atividade_complexa: boolean
    metas_pontos_fortes: string
    metas_pontos_fracos: string
    metas_melhorias: string
    inibidores_falta_integracao: boolean
    inibidores_falta_funcao: boolean
    inibidores_problemas_particulares: boolean
    inibidores_dificuldades_chefia: boolean
    inibidores_desinteresse_servidor: boolean
    inibidores_outros: string
    conclusao_apto: boolean
}

interface ParecerConclusivoCreationAttributes extends Optional<ParecerConclusivoAttributes, "id"> { }

@Table({
    timestamps: true,
    tableName: "parecer_conclusivo",
    modelName: "ParecerConclusivo",
    createdAt: false,
    updatedAt: false,
})
export default class ParecerConclusivo extends Model<
    ParecerConclusivoAttributes,
    ParecerConclusivoCreationAttributes
> {

    @Column({
        primaryKey: true,
        type: DataType.INTEGER,
        autoIncrement: true,
        allowNull: false
    })
    declare id: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        references: {
            model: "avaliacoes",
            key: "id"
        }
    })
    declare avaliacao_id: string;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    declare criterio_1_distribuido: number;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    declare criterio_1_obtido: number;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    declare criterio_2_distribuido: number;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    declare criterio_2_obtido: number;
    
    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    declare criterio_3_distribuido: number;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    declare criterio_3_obtido: number;
    
    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    declare criterio_4_distribuido: number;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    declare criterio_4_obtido: number;
    
    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    declare criterio_5_distribuido: number;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    declare criterio_5_obtido: number;
    
    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    declare criterio_6_distribuido: number;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    declare criterio_6_obtido: number;
    
    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    declare criterio_7_distribuido: number;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    declare criterio_7_obtido: number;
    
    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    declare criterio_8_distribuido: number;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    declare criterio_8_obtido: number;
    
    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    declare criterio_9_distribuido: number;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    declare criterio_9_obtido: number;
    
    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    declare criterio_10_distribuido: number;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    declare criterio_10_obtido: number;
    
    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    declare criterio_11_distribuido: number;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    declare criterio_11_obtido: number;
    
    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    declare criterio_12_distribuido: number;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    declare criterio_12_obtido: number;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    declare total_obtido: number;

    
    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    declare total_distribuido: number;

    
    @Column({
        type: DataType.BOOLEAN,
        allowNull: true
    })
    declare atividade_complexa: boolean;

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    declare metas_pontos_fortes: string;
    
    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    declare metas_pontos_fracos: string;
    
    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    declare metas_melhorias: string;
    
    @Column({
        type: DataType.BOOLEAN,
        allowNull: true
    })
    declare inibidores_falta_integracao: boolean;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: true
    })
    declare inibidores_falta_funcao: boolean;
    
    @Column({
        type: DataType.BOOLEAN,
        allowNull: true
    })
    declare inibidores_problemas_particulares: boolean;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: true
    })
    declare inibidores_dificuldades_chefia: boolean;
    
    @Column({
        type: DataType.BOOLEAN,
        allowNull: true
    })
    declare inibidores_desinteresse_servidor: boolean;
    
    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    declare inibidores_outros: string;
    
    @Column({
        type: DataType.BOOLEAN,
        allowNull: true
    })
    declare conclusao_apto: boolean;
    
}