import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, ILike, Repository } from "typeorm";
import { Produto } from "../entities/produto.entity";


@Injectable()
export class ProdutoService {
    constructor(
        @InjectRepository(Produto)
        private produtoRepository: Repository<Produto>
    ) { }

    async findAll(): Promise<Produto[]> {
        return await this.produtoRepository.find({
            relations: {
                categoria: true
            }
        });
    }

    async findById(id: number): Promise<Produto> {

        let produto = await this.produtoRepository.findOne({
            where: {
                id
            },
            relations: {
              categoria: true
            }
        });

        if (!produto)
            throw new HttpException('Produto não encontrado!', HttpStatus.NOT_FOUND);

        return produto;
    }

    async findByNome(nome: string): Promise<Produto[]> {
        return await this.produtoRepository.find({
            where: {
                nome: ILike(`%${nome}%`)
            },
            relations: {
              categoria: true
            }
        })
    }

    async create(Produto: Produto): Promise<Produto> {
        return await this.produtoRepository.save(Produto);
    }

    async update(Produto: Produto): Promise<Produto> {

        let buscaProduto = await this.findById(Produto.id);

        if (!buscaProduto || !Produto.id)
            throw new HttpException('Produto não encontrado!', HttpStatus.NOT_FOUND);

        return await this.produtoRepository.save(Produto);
    }

    async delete(id: number): Promise<DeleteResult> {

        let buscaProduto = await this.findById(id);

        if (!buscaProduto)
            throw new HttpException('Produto não encontrada!', HttpStatus.NOT_FOUND);

        return await this.produtoRepository.delete(id);

    }

}