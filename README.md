## Requirements
* Node 8.4.0 or later (can be downloaded from https://nodejs.org/en/)
* Git

## Installation
```cmd
npm i
```
* delete folder mocha-rp-reporter from node_modules
* move folder mocha-rp-reporter from root to node_modules

```cmd
npm run pre-test
```
## Running tests
```cmd
npm test
```

## REST API

#### 1)	POST Launch

url: https://rp.epam.com/api/v1/oleksandr_panibratenko_personal/launch?access_token=zzzzzz-03a9-yyyy-92a2-xxxxxxxx

headers:
```
{ 'User-Agent': 'Node.js', 'Content-Type': 'application/json' }
```

body(json):
```
{
name: '[LAUNCH NAME-->TEST151017<]###',
              start_time: 1510755820794,
              description: '',
       tags: undefined
}
```

Возвращает id ланча:

```
{
       id: 5a0c41aeb3cb1f000167b7a3
}
```
Он нужен, чтоб ланч закрыть.



#### 2)	POST start Root Item

url: https://rp.epam.com/api/v1/oleksandr_panibratenko_personal/item?access_token=zzzzzz-03a9-yyyy-92a2-xxxxxxxx

headers:

```
{ 'User-Agent': 'Node.js', 'Content-Type': 'application/json' }
```

body(json):

```
{
name: 'First spec',
              launch_id: '5a0c4dedb3cb1f00016bab29',     
              start_time: 1510755821238,
              type: 'SUITE',
              description: 'First spec',
       tags: undefined
}
```

Возвращает id Root Item:

```
{      
    "id": "5a0c576ab3cb1f00016f216f"
}
```

Он нужен для finishItem.


#### 3)	POST start Child Item в урле есть айдишник родителя Root Item а в теле есть ланч айди!

url: https://rp.epam.com/api/v1/oleksandr_panibratenko_personal/item/5a0c677cb3cb1f00017304f6?access_token=zzzzzz-03a9-yyyy-92a2-xxxxxxxx

headers:
```
{ 'User-Agent': 'Node.js', 'Content-Type': 'application/json' }
```

body(json):
```
{
name: 'should fail test',
              launch_id: '5a0c677cb3cb1f00017304e4',
              start_time: 1510762364211,
              type: 'TEST',
              description: 'First spec should fail test',
       tags: undefined
}
```

Возвращает id Child Item:

```
{
    "id": "5a0c6b95b3cb1f00017493ac"
}
```

Он нужен для finishItem.




#### 4)	POST sendLog в теле есть айди Child Item!

url: https://rp.epam.com/api/v1/oleksandr_panibratenko_personal/log?access_token=zzzzzz-03a9-yyyy-92a2-xxxxxxxx

headers:
```
{ 'User-Agent': 'Node.js', 'Content-Type': 'application/json' }
```

body(json):

```
{
item_id: '5a0c677cb3cb1f0001730505',
              time: 1510762364380,
              level: 'ERROR',
       message: 'Test Failed'
}
```

Возвращает id sendLog:

```
{
    "id": "5a0c6dbfb3cb1f00017595a0"
}
```

Он нужен для finishItem.




#### 5)	PUT finish Item Закрывает Root Item или Child Item или sendLog. В урле должен быть id того, что закрывается.

url:  https://rp.epam.com/api/v1/oleksandr_panibratenko_personal/item/5a0c576ab3cb1f00016f216f?access_token=zzzzzz-03a9-yyyy-92a2-xxxxxxxx

headers:
```
{ 'User-Agent': 'Node.js', 'Content-Type': 'application/json' }
```

body(json):

```
{
status: 'failed',
end_time: 1510755821754
}
```

Возвращает:

```
{
                     "msg": "TestItem with ID = '5a0c576ab3cb1f00016f216f' successfully finished."
}
```

#### 6)	PUT finishLaunch

url:  https://rp.epam.com/api/v1/oleksandr_panibratenko_personal/launch/5a0c41aeb3cb1f000167b7a3/finish?access_token=zzzzzz-03a9-yyyy-92a2-xxxxxxxx

headers:
```
{ 'User-Agent': 'Node.js', 'Content-Type': 'application/json' }
```

body(json):

```
{
       end_time: 1510752942730
}
```

Возвращает:

```
{
    "msg": "Launch with ID = '5a0c41aeb3cb1f000167b7a3' successfully finished."
}
```
## ISSUES

### Плюсы:
Работает :)
Можно менять в configs\config.js разные процедуры тестирования... и все равно работает :)

### Нюансы:
Для хранения промежуточного состояния я применяю  синхронные записи в файлы. Не уверен, что это бест практис.
Синхронные записи тормозят тестирования приблизительно на секунду-две. Думаю, на фоне общих тестов, это не критично.
Если по какой-то причине ланч не закрылся, нужно перед новым стартом тестирования руками стирать содержимое файлов count_.txt и LaunchId_.txt. Это можно будет доработать, если оставим записи в файлы.
