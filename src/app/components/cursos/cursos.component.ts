import { CursosService } from './../../cursos.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Curso } from 'src/app/Curso';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

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
  pipe = new DatePipe('en-US');

  constructor(private cursosService: CursosService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.cursosService.PegarTodos().subscribe(resultado => {
      this.cursos = resultado.body;
      this.cursos.forEach(curso => {
        let dataInicioFormatado = this.pipe.transform(curso.dataInicio, 'dd/MM/yyyy');
        let dataTerminoFormatado = this.pipe.transform(curso.dataTermino, 'dd/MM/yyyy');
        curso.dataInicio = dataInicioFormatado;
        curso.dataTermino = dataTerminoFormatado;
      });
    });
  }

  ExibirFormularioCadastro(): void {
    this.visibilidadeTabela = false;
    this.visibilidadeFormulario = true;

    this.tituloFormulario = 'Novo Curso'

    this.formulario = new FormGroup({
      nome: new FormControl(null, Validators.required),
      dataInicio: new FormControl(null),
      dataTermino: new FormControl(null),
      vagas: new FormControl(0),
      categoriaId: new FormControl(null)
    });
  }

  ExibirFormularioAtualizacao(cursoId: number): void {
    this.cursosService.PegarPorId(cursoId).subscribe(resultado => {
      this.tituloFormulario = `Atualizar ${resultado.nome}`;

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
      this.cursosService.AtualizarCurso(curso, curso.id).subscribe(
        data => {
          this.cursosService.PegarTodos().subscribe(reg => {
            this.cursos = reg.body;

            this.cursos.forEach(curso => {
              let dataInicioFormatado = this.pipe.transform(curso.dataInicio, 'dd/MM/yyyy');
              let dataTerminoFormatado = this.pipe.transform(curso.dataTermino, 'dd/MM/yyyy');
              curso.dataInicio = dataInicioFormatado;
              curso.dataTermino = dataTerminoFormatado;
            });
          });

          this.toastr.success(`${curso.nome} foi atualizado com sucesso.`, "Curso atualizado com sucesso.", {
            "closeButton": false,
            "newestOnTop": false,
            "progressBar": true,
            "positionClass": "toast-bottom-right",
            "easing": "swing",
          });

          this.visibilidadeFormulario = false;
          this.visibilidadeTabela = true;
        },
        error => {
          this.toastr.error(`${error.error}`, 'Não foi possível atualizar este curso.', {
            "closeButton": false,
            "newestOnTop": false,
            "progressBar": true,
            "positionClass": "toast-bottom-right",
            "easing": "swing",
          });
        });


    }
    else {
      curso.status = true;
      if (curso.nome == null || curso.dataInicio == null || curso.dataTermino == null || curso.vagas == undefined || curso.categoriaId == null) {
        this.toastr.error('Todos os campos devem estar preenchidos', 'Erro', {
          "closeButton": false,
          "newestOnTop": false,
          "progressBar": true,
          "positionClass": "toast-bottom-right",
          "easing": "swing",
        });
        return;
      }
      this.cursosService.SalvarCurso(curso).subscribe(
        data => {
          this.cursosService.PegarTodos().subscribe(response => {
            this.cursos = response.body;

            this.cursos.forEach(curso => {
              let dataInicioFormatado = this.pipe.transform(curso.dataInicio, 'dd/MM/yyyy');
              let dataTerminoFormatado = this.pipe.transform(curso.dataTermino, 'dd/MM/yyyy');
              curso.dataInicio = dataInicioFormatado;
              curso.dataTermino = dataTerminoFormatado;
            });
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
          });
        });
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

        this.cursos.forEach(curso => {
          let dataInicioFormatado = this.pipe.transform(curso.dataInicio, 'dd/MM/yyyy');
          let dataTerminoFormatado = this.pipe.transform(curso.dataTermino, 'dd/MM/yyyy');
          curso.dataInicio = dataInicioFormatado;
          curso.dataTermino = dataTerminoFormatado;
        });
      });
    });
  }

  Voltar(): void {
    this.visibilidadeFormulario = false;
    this.visibilidadeTabela = true;
  }

  get nome() { return this.formulario.get('nome'); }
  get dataInicio() { return this.formulario.get('dataInicio') }
  get dataTermino() { return this.formulario.get('dataTermino') }
  get vagas() { return this.formulario.get('vagas') }
  get categoriaId() { return this.formulario.get('categoriaId') }
}
