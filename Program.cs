using Controle_de_gastos.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Injeção de Dependencia do Banco de Dados
// Configura o Entity Framework para ultilizar o SQLite localmente nesta fase de desenvolvimento
// o banco será salvo automaticamente no arquivo 'gastoslocal.db'.

builder.Services.AddDbContext<AppdbContext>(options => 
  options.UseSqlite("Data Source=gastoslocal.db"));

// Adiciona o suporte interno para receber requisições HTTP
builder.Services.AddControllers();

var app = builder.Build();

// Mapeia as rotas de acesso da API de acordo com os Controllers existente
app.MapControllers();

// coloca a API no ar aguardando requisições
app.Run();