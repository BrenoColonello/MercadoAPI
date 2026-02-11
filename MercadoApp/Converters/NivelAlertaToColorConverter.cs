using System.Globalization;

namespace MercadoApp.Converters;

/// <summary>Converte NivelAlerta (0=verde, 1=laranja, 2=vermelho) para Color.</summary>
public class NivelAlertaToColorConverter : IValueConverter
{
    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        if (value is not int n) return Colors.Gray;
        return n switch
        {
            2 => Color.FromArgb("#C62828"), // vermelho
            1 => Color.FromArgb("#F57C00"),  // laranja
            _ => Color.FromArgb("#2E7D32")  // verde
        };
    }

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture) =>
        throw new NotImplementedException();
}
