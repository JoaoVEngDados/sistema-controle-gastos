using System.Xml.Serialization;
using Controle_de_gastos.Data;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.SwaggerGen;
var builder = WebApplication.CreateBuilder(args);

// ESTE BLOCO: Libera o CORS para o React conseguir ler os dados
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirFrontEnd", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Injeção de Dependencia do Banco de Dados
// Configura o Entity Framework para ultilizar o SQLite localmente nesta fase de desenvolvimento
// o banco será salvo automaticamente no arquivo 'gastoslocal.db'.

builder.Services.AddDbContext<AppdbContext>(options => 
  options.UseSqlite("Data Source=gastoslocal.db"));

// Adiciona o suporte interno para receber requisições HTTP
builder.Services.AddControllers();

// Ativando a geração do Swagger
 builder.Services.AddEndpointsApiExplorer();
 builder.Services.AddSwaggerGen();


var app = builder.Build();
// Ligando a interface visual do Swagger no navegador
   app.UseSwagger();
   app.UseSwaggerUI();

// Ativa a liberação antes de rodar a API
app.UseCors("PermitirFrontEnd");

// Mapeia as rotas de acesso da API de acordo com os Controllers existente
app.MapControllers();
// coloca a API no ar aguardando requisições
app.Run();