## API-REST-ZHealth

#### Modelo de API REST para cadastro de médicos e prescrições receitas usando:

-   NodeJs com Express, MongoDB, Mongoose, MochaJs, ChaiJs, Docker, Bycript, JWT em POO.

### Installation

Instalar dependencias:

```sh
$ npm install
```

Iniciar container do MongoDB:

```sh
$ docker run --name mongodb -p 27017:27017 -d mongo
```

Efetuar testes:

```sh
$ npm test
```

Iniciar aplicação:

```sh
$ node index.js
```

### Iniciar

---

# Doctor

> POST http://localhost:3000/doctors

### Espera:

```JSON
{
	"name": "Josely Samara",
	"cpf": "03309273800",
	"email": "marcio@correa.com.br",
	"birth": "16/03/1992",
	"crm": "123455578",
	"statecrm": "DF",
	"sex": "M",
	"firstPassword": "Flamengo1895",
	"secondPassword": "Flamengo1895"
}
```

Existe as seguintes validações:

1.  Name não aceita números ou carácteres especiais.
2.  CPF deve conter exatamente 11 digitos.
3.  Email deve ter formato válido de email.
4.  CRM deve ter entre 4 e 10 digitos.
5.  StateCRM deve ter entre 2 e 20 letras não poderendo carácteres especiais ou números.
6.  Sex: Apenas M ou F.
7.  firstPassword e secondPassword Deve ter no mínimo 8 carácteres contendo números e letras.

-   Caso não atenda as expectativas esseserá o retorno:

```JSON
{
  "status": "error",
  "statusCode": 406,
  "info": "Failed to validate data",
  "errors": {
    "error": "Invalid filds",
    "count": 8,
    "errors": {
      "email": "Differs from email format. Exemple: johndoe@zhealth.com.br",
      "cpf": "It is not a valid CPF, it must contain exactly 11 digits and cannot contain letter or special characters. example: 12345678912",
      "crm": "It is not a valid CRM, it must contain between 4 and 10 digits, letters or special characters are not accepted. Example: 123456",
      "birth": "invalid date format, the correct one should be: 00/00/000",
      "name": "Invalid name, minimum 2 characters, numbers or special characters are not accepted",
      "stateCRM": "Type of status is invalid, numbers or special characters are not accepted. Example: PR or Distrito Federal",
      "sex": "Invalid Sex",
      "password": "Minimum of eight characters, at least one letter and one number"
    }
  },
  "doctor": {
    "name": "Jon@",
    "cpf": "10",
    "email": "johndoe.com.bt",
    "birth": "16031992",
    "crm": "178",
    "statecrm": "DF1",
    "sex": "1",
    "firstPassword": "Flam",
    "secondPassword": "Flamengo1895"
  }
}
}
```

-   Se tudo ocorrer bem esse será o retorno:

```JSON
{
	{
  "status": "sucess",
  "statusCode": 201,
  "info": "User created and generated token",
  "tryToSave": {
    "createdAt": "2020-06-17T01:49:14.676Z",
    "_id": "5ee976d5491c60095c937e6f",
    "name": "John Doe",
    "cpf": "03309278805",
    "email": "john@doe.com.bt",
    "birth": "16/03/1992",
    "crm": "12355578",
    "statecrm": "DF",
    "sex": "M",
    "__v": 0
	  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlZTk3NmQ1NDkxYzYwMDk1YzkzN2U2ZiIsImVtYWlsIjoiam9obkBkb2UuY29tLmJ0IiwiaWF0IjoxNTkyMzU4NjEzLCJleHAiOjE1OTI1MzE0MTN9.XE85tIwlI2UlYmheY4Jw26lJDDrROZdzrACs3x_Fvo0"
	}
}
```

Neste momento é gerado o token JWT para o usuário.

-   Caso o Usuário já esteja cadastrado esse será o retorno:

```JSON

{
  "status": "error",
  "statusCode": 406,
  "info": "User already exists",
  "errors": {
    "error": "values exist in the database",
    "count": 3,
    "details": {
      "email": "EMAIL is already in the database.",
      "cpf": "CPF is already in the database.",
      "crm": "CRM is already in the database."
    }
  },
  "doctor": {
    "name": "John Doe",
    "cpf": "03309278805",
    "email": "john@doe.com.bt",
    "birth": "16/03/1992",
    "crm": "123455578",
    "statecrm": "DF",
    "sex": "M",
    "firstPassword": "Flamengo1895",
    "secondPassword": "Flamengo1895"
	  }
}

```

---

> POST http://localhost:3000/doctors/authenticate

### Espera:

O campo identificação pode ser ser o email, CPF ou CRM do médico.

```JSON
{
	"identification": "john@ddoe.com.bt",
	"password": "Flamengo1895"
}
```

-   Em caso de dados inválidos:

```JSON
{
  "status": "error",
  "statusCode": 403,
  "info": "unidentified data type"
}
```

-   Em caso de sucesso:

```JSON
{
  "status": "sucess",
  "statusCode": 200,
  "info": "genetared token",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlZTk3NmQ1NDkxYzYwMDk1YzkzN2U2ZiIsImVtYWlsIjoiam9obkBkZG9lLmNvbS5idCIsImlhdCI6MTU5MjM1OTYyMiwiZXhwIjoxNTkyNTMyNDIyfQ.D62szJpbSS0huC5Z27BXhVu4Bmk9HKSC2VXyPdlB_2M"
}
```

Também é gerado o mesmo token, estas são as únicas rotas abertas atualmente, todas as rotas a seguir exigen o token de identificação, caso não tenha retornará:

```JSON
{
  "status": "error",
  "statusCode": 401,
  "info": "Access denied"
}
```

---

> PUT E PATCH http://localhost:3000/doctors/{Id}

### Espera:

```JSON
{
	"name": "José",
	"cpf": "03309273104",
	"email": "marcio@correa.com.br",
	"birth": "16/03/1992",
	"crm": "12345678",
	"statecrm": "DF",
	"sex": "M"
}
```

Sucesso:

```JSON
{
  "status": "success",
  "statusCode": 202,
  "info": "updated user",
  "user": {
    "count": 1,
    "doctors": [
      {
        "createdAt": "2020-06-17T01:49:14.676Z",
        "_id": "5ee976d5491c60095c937e6f",
        "name": "John Doe",
        "cpf": "03092784805",
        "email": "john@ddoe.com.bt",
        "birth": "16/03/1992",
        "crm": "1234555788",
        "statecrm": "DF",
        "sex": "M",
        "password": "$2a$04$s8MKws/l5h002xIGzjuYD.u7FtO1vwTDOIVmpqf1Sighi7.4dRjaq",
        "__v": 0
      }
    ]
  }
}
```

Caso o token de autenthicasão seja inválido ou i Id não encontrado retorna:

```JSON
{
  "status": "error",
  "statusCode": 401,
  "info": "Not found"
}
```

---

> Delete http://localhost:3000/doctors/{Id}

### Espera:

Em caso de sucesso retorna:

```JSON
{
  "status": "success",
  "statusCode": 200,
  "info": "user deleted"
}
```

Caso o token de autenthicasão seja inválido ou i Id não encontrado retorna:

```JSON
{
  "status": "error",
  "statusCode": 401,
  "info": "Not found"
}
```

---

> GET http://localhost:3000/doctors/

```JSON
{
  "status": "success",
  "statusCode": 200,
  "info": "Data found",
  "result": {
    "count": 2,
    "doctors": [
      {
        "createdAt": "2020-06-17T01:49:14.676Z",
        "_id": "5ee97c03491c60095c937e70",
        "name": "John Doe",
        "cpf": "03309278805",
        "email": "john@doe.com.bt",
        "birth": "16/03/1992",
        "crm": "123455578",
        "statecrm": "DF",
        "sex": "M",
        "__v": 0
      },
      {
        "createdAt": "2020-06-17T01:49:14.676Z",
        "_id": "5ee97c18491c60095c937e71",
        "name": "José",
        "cpf": "03309273104",
        "email": "marcio@correa.com.bt",
        "birth": "16/03/1992",
        "crm": "12345678",
        "statecrm": "DF",
        "sex": "M",
        "__v": 0
      }
    ]
  }
}
```

---

# Prescription

> POST http://localhost:3000/prescription

### Espera:

```JSON
{
	"cpf": "03309273104",
	"name": "Marcio",
	"birth": "16/03/1992",
    "sex": "M",
    "doctor_details": {
		"name": "Marcio",
	"cpf": "03309273104",
	"crm": "12345678",
	"statecrm": "DF",
	"medicines": [
		{
		"description": "description",
		"quantity": "quantity",
		"dosage": "dosage",
		"frequency": "frequency"
		},
		{
		"description": "description",
		"quantity": "quantity",
		"dosage": "dosage",
		"frequency": "frequency"
		}
		]

	}
}
```

Todos os campos tem válidações tal como foi feito no Schema de doctors.

Em caso de sucerro retornará:

```JSON
{
  "info": "prescription created",
  "statusCode": "201",
  "prescription": {
    "createdAt": "2020-06-16T18:39:44.257Z",
    "_id": "5ee9122c1532d632e0b38773",
    "cpf": "03309273104",
    "name": "Marcio",
    "birth": "16/03/1992",
    "sex": "M",
    "medicines": [
      {
        "_id": "5ee9122c1532d632e0b38774",
        "description": "description",
        "quantity": "quantity",
        "dosage": "dosage",
        "frequency": "frequency"
      },
      {
        "_id": "5ee9122c1532d632e0b38775",
        "description": "description",
        "quantity": "quantity",
        "dosage": "dosage",
        "frequency": "frequency"
      }
    ],
    "doctor_details": {
      "name": "Marcio",
      "cpf": "03309273104",
      "crm": "12345678",
      "statecrm": "DF"
    },
    "doctor": "5ee910d5a1428d308851eb9d",
    "__v": 0
  }
}
```

Perceba que o relacionamento com o médico é enserido automaticamente, reta ao FrontEnd fazer cash dos dados do médico para que não seja necessário digitar todas as vezes.

---
