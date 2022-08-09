let array1 = [
    {nombre:'', code: 1},
    {nombre:'', code: 2},
    {nombre:'', code: 3},
]
let new_code

do {
    new_code = 5
} while (array1.some(e =>e.code === new_code))