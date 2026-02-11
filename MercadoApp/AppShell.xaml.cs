using MercadoApp.Pages;

namespace MercadoApp;

public partial class AppShell : Shell
{
	public AppShell()
	{
		InitializeComponent();
		RegistrarRotas();
		DefinirPaginaInicial();
	}

	private void RegistrarRotas()
	{
		Routing.RegisterRoute("ListaProdutos", typeof(ListaProdutosPage));
		Routing.RegisterRoute("AddProduto", typeof(AddProdutoPage));
		Routing.RegisterRoute("EditProduto", typeof(EditProdutoPage));
	}

	private void DefinirPaginaInicial()
	{
		var services = Application.Current?.Handler?.MauiContext?.Services;
		if (services == null) return;
		var main = services.GetRequiredService<ListaProdutosPage>();
		Items.Add(new ShellContent
		{
			Title = "Estoque",
			Route = "ListaProdutos",
			Content = main
		});
	}
}
