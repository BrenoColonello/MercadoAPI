namespace MercadoApi.Models;

public class Produto
{
    public int Id { get; set; }
    public string NomeProduto { get; set; } = string.Empty;
    /// <summary>URL ou Base64 da foto do produto.</summary>
    public string FotoProduto { get; set; } = string.Empty;
    public DateTime DataEntrada { get; set; }
    public DateTime DataValidade { get; set; }
    public int Quantidade { get; set; } = 1;
    public bool Ativo { get; set; } = true;
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
}
