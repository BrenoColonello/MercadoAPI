using System.Globalization;

namespace MercadoApp.Converters;

public class Base64ToImageSourceConverter : IValueConverter
{
    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        if (value is not string s || string.IsNullOrWhiteSpace(s)) return null;
        if (s.StartsWith("data:image", StringComparison.OrdinalIgnoreCase))
        {
            var base64 = s.IndexOf(',') >= 0 ? s.Substring(s.IndexOf(',') + 1) : s;
            try
            {
                return ImageSource.FromStream(() => new MemoryStream(System.Convert.FromBase64String(base64)));
            }
            catch { return null; }
        }
        if (s.StartsWith("http", StringComparison.OrdinalIgnoreCase))
            return ImageSource.FromUri(new Uri(s));
        try
        {
            return ImageSource.FromStream(() => new MemoryStream(System.Convert.FromBase64String(s)));
        }
        catch { return null; }
    }

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture) =>
        throw new NotImplementedException();
}
