namespace MercadoApp.Models;

public class ProdutoDto
{
    public int Id { get; set; }
    public string NomeProduto { get; set; } = string.Empty;
    public string FotoProduto { get; set; } = string.Empty;
    public DateTime DataEntrada { get; set; }
    public DateTime DataValidade { get; set; }
    public int Quantidade { get; set; }
    public bool Ativo { get; set; }
    public DateTime CriadoEm { get; set; }
    public int DiasRestantes { get; set; }
    public string TextoValidade { get; set; } = string.Empty;
    /// <summary>0=verde, 1=laranja, 2=vermelho</summary>
    public int NivelAlerta { get; set; }
}

public class ProdutoCreateDto
{
    public string NomeProduto { get; set; } = string.Empty;
    public string FotoProduto { get; set; } = string.Empty;
    public DateTime DataEntrada { get; set; }
    public DateTime DataValidade { get; set; }
    public int Quantidade { get; set; } = 1;
}

public class ProdutoUpdateDto
{
    public string? NomeProduto { get; set; }
    public string? FotoProduto { get; set; }
    public DateTime? DataEntrada { get; set; }
    public DateTime? DataValidade { get; set; }
    public int? Quantidade { get; set; }
    public bool? Ativo { get; set; }
}

public class ConferirDto
{
    public DateTime? NovaDataValidade { get; set; }
}
