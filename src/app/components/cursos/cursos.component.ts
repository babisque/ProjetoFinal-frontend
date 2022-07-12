import { CursosService } from './../../cursos.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Curso } from 'src/app/Curso';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})
export class CursosComponent implements OnInit {
  formulario: any;
  tituloFormulario: string;
  cursos: Curso[];

  visibilidadeTabela: boolean = true;
  visibilidadeFormulario: boolean = false;

  constructor(private cursosService: CursosService) { }

  ngOnInit(): void {
    this.cursosService.PegarTodos().subscribe(resultado => {
      this.cursos = resultado.body;
      console.log(resultado.headers);
      console.log(resultado.status);
      console.log(resultado.statusText);
    });
  }

  ExibirFormularioCadastro(): void {
    this.visibilidadeTabela = false;
    this.visibilidadeFormulario = true;

    this.tituloFormulario = 'Novo Curso'

    this.formulario = new FormGroup({
      nome: new FormControl(null),
      dataInicio: new FormControl(null),
      dataTermino: new FormControl(null),
      vagas: new FormControl(null),
      categoriaId: new FormControl(null)
    });
  }

  ExibirFormularioAtualizacao(cursoId: number): void {
    this.cursosService.PegarPorId(cursoId).subscribe(resultado => {
      this.tituloFormulario = `Atualizar ${resultado.nome}`;
      console.log(resultado.status)

      this.formulario = new FormGroup({
        id: new FormControl(resultado.id),
        nome: new FormControl(resultado.nome),
        dataInicio: new FormControl(resultado.dataInicio),
        dataTermino: new FormControl(resultado.dataTermino),
        vagas: new FormControl(resultado.vagas),

        categoriaId: new FormControl(resultado.categoriaId)
      });

      this.visibilidadeTabela = false;
      this.visibilidadeFormulario = true;
    });
  }

  EnviarFormulario(): void {
    const curso: Curso = this.formulario.value;

    if (curso.id > 0) {
      this.cursosService.AtualizarCurso(curso, curso.id).subscribe(resultado => {
        this.visibilidadeFormulario = false;
        this.visibilidadeTabela = true;
        alert(`Curso ${curso.nome} atualizado com sucesso`);
        this.cursosService.PegarTodos().subscribe(reg => {
          this.cursos = reg.body;
        });
      });
    }
    else {
      curso.status = true;
      this.cursosService.SalvarCurso(curso).subscribe((resultado: Response) => {
        this.visibilidadeFormulario = false;
        this.visibilidadeTabela = true;
        console.log(resultado.headers);
        console.log(resultado.status);
        console.log(resultado.statusText);
        alert(`Curso ${curso.nome} inserido com sucesso`);
        this.cursosService.PegarTodos().subscribe(reg => {
          this.cursos = reg.body;
        });
      });
    }
  }

  ExcluirCurso(cursoId: number): void {
    this.cursosService.ExcluirCurso(cursoId).subscribe(resultado => {
      alert(`Curso deletado com sucesso`);
      this.cursosService.PegarTodos().subscribe(reg => {
        this.cursos = reg.body;
      });
    });
  }

  Voltar(): void {
    this.visibilidadeFormulario = false;
    this.visibilidadeTabela = true;
  }
}
