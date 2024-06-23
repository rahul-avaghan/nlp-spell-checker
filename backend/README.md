

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
pip install flask , textblob , autocorrect
```
* Run the app
```
flask --app app run --port 8000 --debugger
```

* **Endpoints
Request**
1. spellcheck
```
curl --location --request POST 'http://localhost:8000/spellcheck' \
--header 'Content-Type: application/json' \
--data-raw '{
    "text": "spell chec"
}'
```
Response
```
{
    "corrected_text": "spell check",
    "original_text": "spell chec"
}
```

2.For uploading file

```
curl --location --request POST 'http://127.0.0.1:8000/upload' \
--form 'file=@"/Users/rahulavaghan/Desktop/y.txt"'
```
