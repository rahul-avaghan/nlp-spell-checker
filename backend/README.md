

## Instuctions to run the app

* Use python version `3.8.0`

* set python env

```
python -m venv .venv   
```

```
 source .venv/bin/activate  
```

* Install dependencies

```
pip install flask pandas pyspellchecker
```
* Run the app
```
flask --app app run --port 8000 --debugger
```

* **Endpoints
Request**
1. spellcheck
```
curl -X POST -H "Content-Type: application/json" -d '{"text": "Thiss iss a testt."}' http://localhost:5000/correct
```
Response
```
{
  "corrected_text": "this is a test"
}

```

2.For uploading file

```
curl -X POST -F "file=@path/to/your/file.txt" http://localhost:5000/upload
```
