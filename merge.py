from googletrans import Translator
import json

# Открываем первый файл и загружаем его содержимое
with open('cur_name.json', 'r') as file:
    data1 = json.load(file)

# Открываем второй файл и загружаем его содержимое
with open('common-currency.json', 'r') as file:
    data2 = json.load(file)

# Создаем экземпляр класса Translator из библиотеки googletrans
translator = Translator()

# Создаем пустой словарь, в который будем добавлять данные
merged_data = {}

# Обходим элементы первого файла и добавляем их в словарь
for key, value in data1.items():
    merged_data[key] = {
        "symbol": key,
        "name": value,
        "symbol_native": "",
        "decimal_digits": 0,
        "rounding": 0,
        "code": key,
        "name_plural": value + "s"
    }

# Обходим элементы второго файла и добавляем их в словарь
for key, value in data2.items():
    merged_data[key] = value

# Для каждого элемента в JSON файле, переводим поле "name" на русский язык
for key in merged_data:
    name = merged_data[key]["name"]
    # Выполняем перевод
    translated_name = translator.translate(name, src='en', dest='ru').text
    # Записываем переведенное значение обратно в JSON файл
    merged_data[key]["name_ru"] = translated_name
    print(f"Key: {key}, Name (ru): {merged_data[key]['name_ru']}, Translated name: {translated_name}")


# Записываем объединенные данные в новый файл
with open('cur.json', 'w') as file:
    json.dump(merged_data, file, indent=4)
