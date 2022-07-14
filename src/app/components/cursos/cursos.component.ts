import { CursosService } from './../../cursos.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Curso } from 'src/app/Curso';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

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

  constructor(private cursosService: CursosService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.cursosService.PegarTodos().subscribe(resultado => {
      this.cursos = resultado.body;
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
      this.cursosService.SalvarCurso(curso).subscribe(
        data => {
          this.cursosService.PegarTodos().subscribe(response => {
            this.cursos = response.body;
          });

          this.visibilidadeFormulario = false;
          this.visibilidadeTabela = true;

          this.toastr.success(`${curso.nome} foi incluído com sucesso.`, "Curso incluído com sucesso.", {
            "closeButton": false,
            "newestOnTop": false,
            "progressBar": true,
            "positionClass": "toast-bottom-right",
            "easing": "swing",
          });
        },
        error => {
          this.toastr.error(`${error.error}`, 'Não foi possível adicionar este curso.', {
            "closeButton": false,
            "newestOnTop": false,
            "progressBar": true,
            "positionClass": "toast-bottom-right",
            "easing": "swing",
          })
        }
      );
    }
  }

  ExcluirCurso(cursoId: number): void {
    this.cursosService.ExcluirCurso(cursoId).subscribe(resultado => {
      this.toastr.warning('Curso deletado com sucesso!', 'Curso deletado com sucesso.', {
        "closeButton": false,
            "newestOnTop": false,
            "progressBar": true,
            "positionClass": "toast-bottom-right",
            "easing": "swing",
      })
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
