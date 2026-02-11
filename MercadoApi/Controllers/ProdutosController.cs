using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MercadoApi.Data;
using MercadoApi.Models;
using MercadoApi.Models.Dto;
using MercadoApi.Services;

namespace MercadoApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProdutosController : ControllerBase
{
    private readonly MercadoDbContext _db;

    public ProdutosController(MercadoDbContext db)
    {
        _db = db;
    }

    /// <summary>Lista produtos ativos ordenados por data de validade (mais próximo primeiro).</summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProdutoDto>>> Listar([FromQuery] string? busca)
    {
        var query = _db.Produtos.Where(p => p.Ativo);
        if (!string.IsNullOrWhiteSpace(busca))
            query = query.Where(p => p.NomeProduto.Contains(busca));
        var lista = await query.OrderBy(p => p.DataValidade).ToListAsync();
        return lista.Select(ValidadeService.ToDto).ToList();
    }

    /// <summary>Obtém um produto por ID.</summary>
    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProdutoDto>> ObterPorId(int id)
    {
        var p = await _db.Produtos.FindAsync(id);
        if (p == null) return NotFound();
        return ValidadeService.ToDto(p);
    }

    /// <summary>Cria um novo produto.</summary>
    [HttpPost]
    public async Task<ActionResult<ProdutoDto>> Criar([FromBody] ProdutoCreateDto dto)
    {
        var p = new Produto
        {
            NomeProduto = dto.NomeProduto,
            FotoProduto = dto.FotoProduto ?? string.Empty,
            DataEntrada = dto.DataEntrada,
            DataValidade = dto.DataValidade,
            Quantidade = dto.Quantidade,
            Ativo = true,
            CriadoEm = DateTime.UtcNow
        };
        _db.Produtos.Add(p);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(ObterPorId), new { id = p.Id }, ValidadeService.ToDto(p));
    }

    /// <summary>Atualiza um produto (editar ou marcar como conferido com nova validade).</summary>
    [HttpPut("{id:int}")]
    public async Task<ActionResult<ProdutoDto>> Atualizar(int id, [FromBody] ProdutoUpdateDto dto)
    {
        var p = await _db.Produtos.FindAsync(id);
        if (p == null) return NotFound();
        if (dto.NomeProduto != null) p.NomeProduto = dto.NomeProduto;
        if (dto.FotoProduto != null) p.FotoProduto = dto.FotoProduto;
        if (dto.DataEntrada.HasValue) p.DataEntrada = dto.DataEntrada.Value;
        if (dto.DataValidade.HasValue) p.DataValidade = dto.DataValidade.Value;
        if (dto.Quantidade.HasValue) p.Quantidade = dto.Quantidade.Value;
        if (dto.Ativo.HasValue) p.Ativo = dto.Ativo.Value;
        await _db.SaveChangesAsync();
        return ValidadeService.ToDto(p);
    }

    /// <summary>Marca produto como OK (conferido) e opcionalmente atualiza a data de validade (novo lote).</summary>
    [HttpPatch("{id:int}/conferir")]
    public async Task<ActionResult<ProdutoDto>> Conferir(int id, [FromBody] ConferirDto? body = null)
    {
        var p = await _db.Produtos.FindAsync(id);
        if (p == null) return NotFound();
        if (body?.NovaDataValidade.HasValue == true)
            p.DataValidade = body.NovaDataValidade!.Value;
        p.Ativo = true;
        await _db.SaveChangesAsync();
        return ValidadeService.ToDto(p);
    }

    /// <summary>Desativa o produto (excluir logicamente).</summary>
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Excluir(int id)
    {
        var p = await _db.Produtos.FindAsync(id);
        if (p == null) return NotFound();
        p.Ativo = false;
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

public class ConferirDto
{
    public DateTime? NovaDataValidade { get; set; }
}
