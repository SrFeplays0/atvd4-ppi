import express from 'express';
import path from 'path';
import session from 'express-session';

const host = '0.0.0.0';
const porta = 3000;

let listaUsuarios = [
    { nome: 'admin', senha: 'admin123' } 
];
let listaProdutos = [];

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), 'publico')));

app.use(session({
    secret: 'segredo',
    resave: false,
    saveUninitialized: true
}));

app.get('/', (req, res) => {
    res.redirect('/login');
});

// Página de login
app.get('/login', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'publico', 'login.html'));
});

// Rota de login
app.post('/login', (req, res) => {
    const { nome, senha } = req.body;
    const usuario = listaUsuarios.find(u => u.nome === nome && u.senha === senha);

    if (usuario) {
        req.session.usuario = usuario;
        res.redirect('/cadastrarProduto');
    } else {
        res.send(`
            <p>Usuário ou senha inválidos. <a href="/login">Tente novamente</a></p>
        `);
    }
});

function verificarLogin(req, res, next) {
    if (req.session.usuario) {
        next();
    } else {
        res.send(`
            <p>Você precisa realizar o login para acessar esta página. <a href="/login">Login</a></p>
        `);
    }
}

// Página de cadastro de produto (protegida)
app.get('/cadastrarProduto', verificarLogin, (req, res) => {
    res.sendFile(path.join(process.cwd(), 'publico', 'cadastrarProduto.html'));
});

// Rota para processar o cadastro de produto (protegida)
app.post('/cadastrarProduto', verificarLogin, (req, res) => {
    const { codigoBarras, descricao, precoCusto, precoVenda, dataValidade, qtdEstoque, nomeFabricante } = req.body;

    if (codigoBarras && descricao && precoCusto && precoVenda && dataValidade && qtdEstoque && nomeFabricante) {
        listaProdutos.push({
            codigoBarras,
            descricao,
            precoCusto,
            precoVenda,
            dataValidade,
            qtdEstoque,
            nomeFabricante
        });
        res.send("Produto cadastrado com sucesso!");
    } else {
        res.sendFile(path.join(process.cwd(), 'publico', 'cadastrarProduto.html'));
    }
});

// Rota para listar produtos
app.get('/listarProdutos', (req, res) => {
    res.write('<html>');
    res.write('<head>');
    res.write('<style>');
    res.write('.table {');
    res.write('    width: 100%;');
    res.write('    border-collapse: collapse;');
    res.write('}');
    res.write('.table th, .table td {');
    res.write('    padding: 8px;');
    res.write('    border-bottom: 1px solid #ddd;');
    res.write('    text-align: left;');
    res.write('}');
    res.write('.table th {');
    res.write('    background-color: #f2f2f2;');
    res.write('    color: #333;');
    res.write('}');
    res.write('.table-striped tbody tr:nth-child(odd) {');
    res.write('    background-color: #f9f9f9;');
    res.write('}');
    res.write('</style>');
    res.write('<title>Lista de Produtos</title>');
    res.write('<meta charset="UTF-8">');
    res.write('</head>');
    res.write('<body>');
    res.write('<h1>Lista de Produtos</h1>');
    res.write('<table class="table table-striped">');
    res.write('<tr>');
    res.write('<th>Código de Barras</th>');
    res.write('<th>Descrição</th>');
    res.write('<th>Preço de Custo</th>');
    res.write('<th>Preço de Venda</th>');
    res.write('<th>Data de Validade</th>');
    res.write('<th>Qtd em Estoque</th>');
    res.write('<th>Nome do Fabricante</th>');
    res.write('</tr>');
    for (let i = 0; i < listaProdutos.length; i++) {
        res.write('<tr>');
        res.write(`<td>${listaProdutos[i].codigoBarras}</td>`);
        res.write(`<td>${listaProdutos[i].descricao}</td>`);
        res.write(`<td>${listaProdutos[i].precoCusto}</td>`);
        res.write(`<td>${listaProdutos[i].precoVenda}</td>`);
        res.write(`<td>${listaProdutos[i].dataValidade}</td>`);
        res.write(`<td>${listaProdutos[i].qtdEstoque}</td>`);
        res.write(`<td>${listaProdutos[i].nomeFabricante}</td>`);
        res.write('</tr>');
    }
    res.write('</table>');
    res.write('<a href="/">Voltar</a>');
    res.write('</body>');
    res.write('</html>');

    res.end();
});

app.get('/listarUsuario', (req, res) => {
    res.write('<html>');
    res.write('<head>');
    res.write('<style>');
    res.write('.table {');
    res.write('    width: 100%;');
    res.write('    border-collapse: collapse;');
    res.write('}');
    res.write('.table th, .table td {');
    res.write('    padding: 8px;');
    res.write('    border-bottom: 1px solid #ddd;');
    res.write('    text-align: left;');
    res.write('}');
    res.write('.table th {');
    res.write('    background-color: #f2f2f2;');
    res.write('    color: #333;');
    res.write('}');
    res.write('.table-striped tbody tr:nth-child(odd) {');
    res.write('    background-color: #f9f9f9;');
    res.write('}');
    res.write('</style>');
    res.write('<title>Lista de Usuários</title>');
    res.write('<meta charset="UTF-8">');
    res.write('</head>');
    res.write('<body>');
    res.write('<h1>Lista de Usuários</h1>');
    res.write('<table class="table table-striped">');
    res.write('<tr>');
    res.write('<th>Nome</th>');
    res.write('<th>Telefone</th>');
    res.write('<th>Email</th>');
    res.write('<th>Senha</th>');
    res.write('</tr>');
    for (let i = 0; i < listaUsuarios.length; i++) {
        res.write('<tr>');
        res.write(`<td>${listaUsuarios[i].nome}</td>`);
        res.write(`<td>${listaUsuarios[i].telefone}</td>`);
        res.write(`<td>${listaUsuarios[i].email}</td>`);
        res.write(`<td>${listaUsuarios[i].senha}</td>`);
        res.write('</tr>');
    }
    res.write('</table>');
    res.write('<a href="/">Voltar</a>');
    res.write('</body>');
    res.write('</html>');

    res.end();
});

app.post('/cadastrarUsuario', (req, res) => {
    const { nome, telefone, email, senha } = req.body;

    if (nome && telefone && email && senha) {
        listaUsuarios.push({
            nome,
            telefone,
            email,
            senha,
        });
        res.redirect('/listarUsuario');
    } else {
        res.write(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>atvd4</title>
            <link rel="stylesheet" href="CadStyle.css">
        </head>
        <body>
            <h2> Cadastro de perfil de cliente</h2>
            <form method="post" action="/cadastrarUsuario">
                    <div>
                        <label class="ab" for="name">Nome:</label>
                        <input class="asdwe" type="text" id="name" name="nome" value="${nome}" placeholder="Informe o nome do cliente">
                    `);
        if (!nome) {
            res.write(`
                    <div class="alert alert-danger" role="alert">
                        <strong>Atenção!</strong> Por favor, informe o nome do usuário.
                    </div>
                `);
        }
        res.write(`</div>
                    <br>
                    <div>
                        <label class="ab" for="telefone">Telefone:</label>
                        <input class="jkgfuyk" type="tel" id="telefone" name="telefone" value="${telefone}" placeholder="(99) 99999-9999">
                    `);
        if (!telefone) {
            res.write(`
                            <div class="alert alert-danger" role="alert">
                                <strong>Atenção!</strong> Por favor, digite o telefone.
                            </div>
                        `);
        }
        res.write(`
                    </div>
                    <br>
                    <div>
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" value="${email}">
                    `);
        if (!email) {
            res.write(`
                            <div class="alert alert-danger" role="alert">
                                <strong>Atenção!</strong> Por favor, digite o email.
                            </div>
                        `);
        }
        res.write(`
                    </div>
                    <br>
                    <div>
                        <label for="senha">Senha</label>
                        <input type="password" id="senha" name="senha" value="${senha}">
                    `);
        if (!senha) {
            res.write(`
                            <div class="alert alert-danger" role="alert">
                                <strong>Atenção!</strong> Por favor, digite a senha.
                            </div>
                        `);
        }
        res.write(`
                    </div>
                    <br>
                    <div>
                        <button type="reset">Limpar</button>
                        <button type="submit">Gravar</button>
                    </div>
                </form>
            </body>
        </html>
        `);
        res.end();
    }
});

app.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
});
