namespace MercadoApi.Models.Dto;

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
    /// <summary>Dias restantes até o vencimento (negativo = já vencido).</summary>
    public int DiasRestantes { get; set; }
    /// <summary>Texto amigável: "Vence em X dias", "Vence amanhã", "Vencido há X dias".</summary>
    public string TextoValidade { get; set; } = string.Empty;
    /// <summary>Alerta: 0=verde, 1=laranja (15-30 dias), 2=vermelho (≤14 dias ou vencido).</summary>
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
