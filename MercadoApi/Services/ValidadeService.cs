using MercadoApi.Models;
using MercadoApi.Models.Dto;

namespace MercadoApi.Services;

/// <summary>
/// Calcula dias restantes e texto de validade para exibição no app.
/// Regras: ≤14 dias = alerta vermelho, 15-30 = laranja, &gt;30 = verde.
/// </summary>
public static class ValidadeService
{
    public const int DiasAlertaVermelho = 14;
    public const int DiasAlertaLaranjaMax = 30;

    public static int CalcularDiasRestantes(DateTime dataValidade)
    {
        var hoje = DateTime.Today;
        return (dataValidade.Date - hoje).Days;
    }

    /// <summary>0 = verde, 1 = laranja (15-30 dias), 2 = vermelho (≤14 ou vencido).</summary>
    public static int ObterNivelAlerta(int diasRestantes)
    {
        if (diasRestantes <= DiasAlertaVermelho) return 2; // vermelho
        if (diasRestantes <= DiasAlertaLaranjaMax) return 1; // laranja
        return 0; // verde
    }

    public static string ObterTextoValidade(int diasRestantes)
    {
        if (diasRestantes < 0) return $"Vencido há {-diasRestantes} dias";
        if (diasRestantes == 0) return "Vence hoje";
        if (diasRestantes == 1) return "Vence amanhã";
        return $"Vence em {diasRestantes} dias";
    }

    public static ProdutoDto ToDto(Produto p)
    {
        var dias = CalcularDiasRestantes(p.DataValidade);
        return new ProdutoDto
        {
            Id = p.Id,
            NomeProduto = p.NomeProduto,
            FotoProduto = p.FotoProduto,
            DataEntrada = p.DataEntrada,
            DataValidade = p.DataValidade,
            Quantidade = p.Quantidade,
            Ativo = p.Ativo,
            CriadoEm = p.CriadoEm,
            DiasRestantes = dias,
            TextoValidade = ObterTextoValidade(dias),
            NivelAlerta = ObterNivelAlerta(dias)
        };
    }
}
