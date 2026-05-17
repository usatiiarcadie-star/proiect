const cExtra3 = [
  {
    "slug": "c-sockets-retele",
    "title": "Sockets si Retele in C",
    "order": 31,
    "theory": [
      {
        "order": 1,
        "title": "Introducere in Sockets BSD",
        "content": "Un socket este un endpoint de comunicare intre procese, fie pe aceeasi masina, fie prin retea. In C, API-ul BSD Sockets este standardul de facto pentru programare de retea.\n\nPrincipalele functii:\n- socket() â€” creaza un socket nou\n- bind() â€” asociaza socketul cu o adresa si port\n- listen() â€” asteapta conexiuni (server)\n- accept() â€” accepta o conexiune incomming\n- connect() â€” initiaza o conexiune (client)\n- send() / recv() â€” trimitere si receptie date\n- close() â€” inchide socketul\n\nExemplu creare socket TCP:\n```c\n#include <sys/socket.h>\n#include <netinet/in.h>\n#include <arpa/inet.h>\n#include <unistd.h>\n\nint sockfd = socket(AF_INET, SOCK_STREAM, 0);\nif (sockfd < 0) {\n    perror(\"socket\");\n    exit(1);\n}\n\nstruct sockaddr_in addr;\naddr.sin_family = AF_INET;\naddr.sin_port = htons(8080);\naddr.sin_addr.s_addr = INADDR_ANY;\n\nif (bind(sockfd, (struct sockaddr*)&addr, sizeof(addr)) < 0) {\n    perror(\"bind\");\n    exit(1);\n}\n```\n\nTip interviu: Explica diferenta dintre AF_INET (IPv4) si AF_INET6 (IPv6) si de ce folosim htons() pentru conversie port (byte order)."
      },
      {
        "order": 2,
        "title": "Server TCP â€” accept si recv",
        "content": "Un server TCP trebuie sa asculte conexiuni si sa le proceseze. Modelul simplu este secvential (un client la un moment dat), dar in productie se foloseste multi-threading sau I/O multiplexing.\n\nExemplu server TCP complet:\n```c\n#include <stdio.h>\n#include <string.h>\n#include <sys/socket.h>\n#include <netinet/in.h>\n#include <unistd.h>\n\n#define PORT 8080\n#define BUF_SIZE 1024\n\nint main() {\n    int server_fd = socket(AF_INET, SOCK_STREAM, 0);\n\n    int opt = 1;\n    setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));\n\n    struct sockaddr_in addr = {0};\n    addr.sin_family = AF_INET;\n    addr.sin_port = htons(PORT);\n    addr.sin_addr.s_addr = INADDR_ANY;\n\n    bind(server_fd, (struct sockaddr*)&addr, sizeof(addr));\n    listen(server_fd, 5);\n\n    printf(\"Server asculta pe portul %d\\n\", PORT);\n\n    while (1) {\n        struct sockaddr_in client_addr;\n        socklen_t client_len = sizeof(client_addr);\n        int client_fd = accept(server_fd,\n            (struct sockaddr*)&client_addr, &client_len);\n\n        char buf[BUF_SIZE];\n        int bytes = recv(client_fd, buf, BUF_SIZE - 1, 0);\n        buf[bytes] = '\\0';\n        printf(\"Primit: %s\\n\", buf);\n\n        char* resp = \"HTTP/1.0 200 OK\\r\\n\\r\\nHello!\";\n        send(client_fd, resp, strlen(resp), 0);\n        close(client_fd);\n    }\n    return 0;\n}\n```\n\nTip interviu: Backlog-ul din listen() specifica cati clienti pot astepta in coada. SO_REUSEADDR permite refolosirea portului dupa restart rapid al serverului."
      },
      {
        "order": 3,
        "title": "Client TCP si getaddrinfo",
        "content": "Functia getaddrinfo() este metoda moderna (si portabila) pentru rezolvarea adreselor, inlocuind gethostbyname() care nu este thread-safe.\n\nExemplu client TCP:\n```c\n#include <stdio.h>\n#include <string.h>\n#include <sys/socket.h>\n#include <netdb.h>\n#include <unistd.h>\n\nint connect_to(const char* host, const char* port) {\n    struct addrinfo hints = {0}, *res;\n    hints.ai_family = AF_UNSPEC;      // IPv4 sau IPv6\n    hints.ai_socktype = SOCK_STREAM;  // TCP\n\n    int err = getaddrinfo(host, port, &hints, &res);\n    if (err) {\n        fprintf(stderr, \"getaddrinfo: %s\\n\", gai_strerror(err));\n        return -1;\n    }\n\n    int sockfd = socket(res->ai_family,\n                        res->ai_socktype,\n                        res->ai_protocol);\n    if (connect(sockfd, res->ai_addr, res->ai_addrlen) < 0) {\n        perror(\"connect\");\n        freeaddrinfo(res);\n        return -1;\n    }\n    freeaddrinfo(res);\n    return sockfd;\n}\n\nint main() {\n    int fd = connect_to(\"example.com\", \"80\");\n    if (fd < 0) return 1;\n\n    char* req = \"GET / HTTP/1.0\\r\\nHost: example.com\\r\\n\\r\\n\";\n    send(fd, req, strlen(req), 0);\n\n    char buf[4096];\n    int n;\n    while ((n = recv(fd, buf, sizeof(buf)-1, 0)) > 0) {\n        buf[n] = '\\0';\n        printf(\"%s\", buf);\n    }\n    close(fd);\n    return 0;\n}\n```\n\nTip interviu: getaddrinfo() returneaza o lista de structuri â€” trebuie sa incerci fiecare pana la succes si sa apelezi freeaddrinfo() pentru a evita memory leak."
      },
      {
        "order": 4,
        "title": "UDP si select() pentru I/O multiplexing",
        "content": "UDP (SOCK_DGRAM) este un protocol fara conexiune, mai rapid dar fara garantii de livrare. select() sau poll() permit monitorizarea mai multor file descriptori simultan.\n\nExemplu UDP server:\n```c\n#include <sys/socket.h>\n#include <netinet/in.h>\n#include <stdio.h>\n#include <string.h>\n\nint main() {\n    int fd = socket(AF_INET, SOCK_DGRAM, 0);\n\n    struct sockaddr_in addr = {0};\n    addr.sin_family = AF_INET;\n    addr.sin_port = htons(9090);\n    addr.sin_addr.s_addr = INADDR_ANY;\n    bind(fd, (struct sockaddr*)&addr, sizeof(addr));\n\n    char buf[1024];\n    struct sockaddr_in client;\n    socklen_t len = sizeof(client);\n\n    while (1) {\n        int n = recvfrom(fd, buf, sizeof(buf)-1, 0,\n                         (struct sockaddr*)&client, &len);\n        buf[n] = '\\0';\n        printf(\"UDP primit: %s\\n\", buf);\n        sendto(fd, \"ACK\", 3, 0,\n               (struct sockaddr*)&client, len);\n    }\n    return 0;\n}\n```\n\nselect() pentru multiplexing:\n```c\nfd_set readfds;\nFD_ZERO(&readfds);\nFD_SET(sock1, &readfds);\nFD_SET(sock2, &readfds);\n\nstruct timeval tv = {5, 0}; // timeout 5 secunde\nint ready = select(FD_SETSIZE, &readfds, NULL, NULL, &tv);\nif (ready > 0 && FD_ISSET(sock1, &readfds)) {\n    // sock1 are date disponibile\n}\n```\n\nTip interviu: select() are limita FD_SETSIZE (de obicei 1024). Pentru mai multi descriptori se foloseste poll() sau epoll() (Linux). epoll() este O(1) vs O(n) al select()."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "Ce functie este folosita pentru a crea u",
        "question": "Ce functie este folosita pentru a crea un socket in C?",
        "options": [
          "create_socket()",
          "socket()",
          "open_socket()",
          "new_socket()"
        ],
        "answer": "socket()",
        "explanation": "socket() este functia POSIX standard pentru crearea unui socket nou.",
        "difficulty": "easy"
      },
      {
        "number": 2,
        "name": "Ce face functia htons()",
        "question": "Ce face functia htons()?",
        "options": [
          "Converteste un string in numar",
          "Converteste un numar de la host byte order la network byte order (big-endian)",
          "Converteste un numar de la network la host byte order",
          "Aloca memorie pentru un socket"
        ],
        "answer": "Converteste un numar de la host byte order la network byte order (big-endian)",
        "explanation": "htons() = host to network short. Reteaua foloseste big-endian, iar x86 foloseste little-endian.",
        "difficulty": "easy"
      },
      {
        "number": 3,
        "name": "Care este valoarea constanta folosita pe",
        "question": "Care este valoarea constanta folosita pentru a accepta conexiuni de pe orice interfata de retea?",
        "options": [
          "INADDR_LOCAL",
          "INADDR_ANY",
          "INADDR_ALL",
          "INADDR_BROADCAST"
        ],
        "answer": "INADDR_ANY",
        "explanation": "INADDR_ANY (0.0.0.0) permite serverului sa accepte conexiuni pe toate interfetele disponibile.",
        "difficulty": "easy"
      },
      {
        "number": 4,
        "name": "Ce tip de socket se foloseste pentru UDP",
        "question": "Ce tip de socket se foloseste pentru UDP?",
        "options": [
          "SOCK_STREAM",
          "SOCK_DGRAM",
          "SOCK_RAW",
          "SOCK_PACKET"
        ],
        "answer": "SOCK_DGRAM",
        "explanation": "SOCK_STREAM = TCP (conexiune), SOCK_DGRAM = UDP (fara conexiune).",
        "difficulty": "easy"
      },
      {
        "number": 5,
        "name": "Ce problema rezolva SO_REUSEADDR",
        "question": "Ce problema rezolva SO_REUSEADDR?",
        "options": [
          "Permite mai multor procese sa foloseasca acelasi socket simultan",
          "Permite refolosirea unui port imediat dupa inchiderea serverului",
          "Dubleaza viteza de transfer",
          "Dezactiveaza Nagle algorithm"
        ],
        "answer": "Permite refolosirea unui port imediat dupa inchiderea serverului",
        "explanation": "Fara SO_REUSEADDR, portul ramane in starea TIME_WAIT cateva minute dupa inchidere.",
        "difficulty": "easy"
      },
      {
        "number": 6,
        "name": "Ce face backlog-ul din listen(server_fd,",
        "question": "Ce face backlog-ul din listen(server_fd, backlog)?",
        "options": [
          "Seteaza numarul maxim de clienti concurenti",
          "Seteaza marimea bufferului de receptie",
          "Specifica numarul maxim de conexiuni in asteptare (neacceptate)",
          "Seteaza timeout-ul pentru conexiuni"
        ],
        "answer": "Specifica numarul maxim de conexiuni in asteptare (neacceptate)",
        "explanation": "Backlog-ul defineste marimea cozii de conexiuni care au completat three-way handshake dar nu au fost inca acceptate cu accept().",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "De ce este getaddrinfo() preferata fata",
        "question": "De ce este getaddrinfo() preferata fata de gethostbyname()?",
        "options": [
          "Este mai rapida",
          "Suporta atat IPv4 cat si IPv6 si este thread-safe",
          "Nu necesita header-e suplimentare",
          "Returneaza direct file descriptor-ul socketului"
        ],
        "answer": "Suporta atat IPv4 cat si IPv6 si este thread-safe",
        "explanation": "gethostbyname() foloseste variabile globale (nu este thread-safe) si nu suporta IPv6.",
        "difficulty": "medium"
      },
      {
        "number": 8,
        "name": "Care este complexitatea algoritmului sel",
        "question": "Care este complexitatea algoritmului select() in functie de numarul de file descriptori N?",
        "options": [
          "O(1)",
          "O(log N)",
          "O(N)",
          "O(N^2)"
        ],
        "answer": "O(N)",
        "explanation": "select() itereaza prin toti file descriptorii pana la maximul specificat. epoll() este O(1) pentru fiecare eveniment.",
        "difficulty": "medium"
      },
      {
        "number": 9,
        "name": "Ce functie se foloseste pentru a trimite",
        "question": "Ce functie se foloseste pentru a trimite date UDP?",
        "options": [
          "send()",
          "sendto()",
          "write()",
          "transmit()"
        ],
        "answer": "sendto()",
        "explanation": "sendto() include adresa destinatarului ca parametru, necesara pentru UDP fara conexiune. send() se foloseste pe socketi conectati.",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "Scrie o functie `int create_tcp_server(i",
        "question": "Scrie o functie `int create_tcp_server(int port)` care creeaza un socket TCP, seteaza SO_REUSEADDR, face bind pe portul dat, apeleaza listen cu backlog 10 si returneaza file descriptor-ul.",
        "options": [],
        "answer": "",
        "difficulty": "medium",
        "explanation": "Raspunsul corect este: "
      },
      {
        "number": 11,
        "name": "Scrie o functie `int tcp_connect(const c",
        "question": "Scrie o functie `int tcp_connect(const char* ip, int port)` care creeaza un socket TCP si se conecteaza la adresa si portul specificate. Returneaza fd-ul sau -1 la eroare.",
        "options": [],
        "answer": "",
        "difficulty": "hard",
        "explanation": "Raspunsul corect este: "
      },
      {
        "number": 12,
        "name": "Scrie o functie `int send_all(int fd, co",
        "question": "Scrie o functie `int send_all(int fd, const char* buf, int len)` care garanteaza ca trimite toti `len` bytes (deoarece send() poate trimite partial). Returneaza 0 la succes, -1 la eroare.",
        "options": [],
        "answer": "",
        "difficulty": "hard",
        "explanation": "Raspunsul corect este: "
      },
      {
        "number": 13,
        "name": "Scrie o functie `void echo_server(int se",
        "question": "Scrie o functie `void echo_server(int server_fd)` care accepta in loop clienti TCP si trimite inapoi exact ce primeste (echo), inchizand conexiunea dupa ce clientul inchide.",
        "options": [],
        "answer": "",
        "difficulty": "hard",
        "explanation": "Raspunsul corect este: "
      },
      {
        "number": 14,
        "name": "Scrie o functie `int udp_server(int port",
        "question": "Scrie o functie `int udp_server(int port)` care creeaza un server UDP ce primeste mesaje si printeaza textul primit impreuna cu portul sursa. Ruleaza in loop infinit.",
        "options": [],
        "answer": "",
        "difficulty": "hard",
        "explanation": "Raspunsul corect este: "
      },
      {
        "number": 15,
        "name": "Scrie o functie `int wait_for_data(int f",
        "question": "Scrie o functie `int wait_for_data(int fd, int timeout_sec)` folosind select() care asteapta pana cand fd-ul are date disponibile sau expira timeout-ul. Returneaza 1 daca sunt date, 0 la timeout, -1 la eroare.",
        "options": [],
        "answer": "",
        "difficulty": "hard",
        "explanation": "Raspunsul corect este: "
      }
    ]
  },
  {
    "slug": "c-threads-posix",
    "title": "Threads POSIX in C",
    "order": 32,
    "theory": [
      {
        "order": 1,
        "title": "pthread_create si ciclul de viata al unui thread",
        "content": "POSIX Threads (pthreads) este API-ul standard pentru multithreading in C pe sisteme Unix/Linux. Compilarea necesita flag-ul -lpthread.\n\nFunctii principale:\n- pthread_create() â€” creeaza un thread nou\n- pthread_join() â€” asteapta terminarea unui thread\n- pthread_detach() â€” elibereaza resursele automat la terminare\n- pthread_exit() â€” termina thread-ul curent\n- pthread_self() â€” returneaza ID-ul thread-ului curent\n\nExemplu de baza:\n```c\n#include <pthread.h>\n#include <stdio.h>\n#include <stdlib.h>\n\nvoid* thread_func(void* arg) {\n    int id = *(int*)arg;\n    printf(\"Thread %d pornit\\n\", id);\n    // ... lucru ...\n    printf(\"Thread %d terminat\\n\", id);\n    return NULL;\n}\n\nint main() {\n    pthread_t tid[4];\n    int ids[4];\n\n    for (int i = 0; i < 4; i++) {\n        ids[i] = i;\n        pthread_create(&tid[i], NULL, thread_func, &ids[i]);\n    }\n\n    for (int i = 0; i < 4; i++) {\n        pthread_join(tid[i], NULL);\n    }\n\n    printf(\"Toate thread-urile au terminat\\n\");\n    return 0;\n}\n```\n\nTip interviu: pthread_join() este echivalentul wait() pentru procese. Daca nu faci join sau detach, thread-ul devine \"zombie\" si resursele nu sunt eliberate."
      },
      {
        "order": 2,
        "title": "Mutex â€” excludere mutuala",
        "content": "Un mutex (mutual exclusion) protejeaza sectiunile critice de acces concurent. Fara mutex, operatiile non-atomice pe date partajate pot produce race conditions.\n\nExemplu cu race condition si fix:\n```c\n#include <pthread.h>\n#include <stdio.h>\n\nlong counter = 0;\npthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;\n\nvoid* increment(void* arg) {\n    for (int i = 0; i < 1000000; i++) {\n        pthread_mutex_lock(&lock);\n        counter++;  // sectiune critica\n        pthread_mutex_unlock(&lock);\n    }\n    return NULL;\n}\n\nint main() {\n    pthread_t t1, t2;\n    pthread_create(&t1, NULL, increment, NULL);\n    pthread_create(&t2, NULL, increment, NULL);\n    pthread_join(t1, NULL);\n    pthread_join(t2, NULL);\n    printf(\"Counter: %ld (asteptat: 2000000)\\n\", counter);\n    // Cu mutex: intotdeauna 2000000\n    // Fara mutex: rezultat nedeterminist\n    return 0;\n}\n```\n\nMutex dinamic:\n```c\npthread_mutex_t m;\npthread_mutex_init(&m, NULL);\n// ... folosire ...\npthread_mutex_destroy(&m);\n```\n\nTip interviu: Deadlock apare cand doua thread-uri detin fiecare un mutex si asteapta mutex-ul celuilalt. Solutia: ordering consistent al lock-urilor sau folosirea pthread_mutex_trylock()."
      },
      {
        "order": 3,
        "title": "Semafoare si variabile de conditie",
        "content": "Semafoarele sunt un mecanism de sincronizare mai general decat mutex-ul. sem_wait() decrementeaza (blocheaza daca e 0), sem_post() incrementeaza.\n\nVariabilele de conditie permit thread-urilor sa astepte un eveniment specific.\n\nExemplu Producer-Consumer cu semafoare:\n```c\n#include <pthread.h>\n#include <semaphore.h>\n#include <stdio.h>\n\n#define N 10\nint buffer[N];\nint in = 0, out = 0;\n\nsem_t empty, full;\npthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;\n\nvoid* producer(void* arg) {\n    for (int i = 0; i < 20; i++) {\n        sem_wait(&empty);              // asteapta loc liber\n        pthread_mutex_lock(&mutex);\n        buffer[in] = i;\n        in = (in + 1) % N;\n        pthread_mutex_unlock(&mutex);\n        sem_post(&full);              // semnaleaza item disponibil\n    }\n    return NULL;\n}\n\nvoid* consumer(void* arg) {\n    for (int i = 0; i < 20; i++) {\n        sem_wait(&full);              // asteapta item\n        pthread_mutex_lock(&mutex);\n        int val = buffer[out];\n        out = (out + 1) % N;\n        pthread_mutex_unlock(&mutex);\n        sem_post(&empty);             // semnaleaza loc liber\n        printf(\"Consumat: %d\\n\", val);\n    }\n    return NULL;\n}\n\nint main() {\n    sem_init(&empty, 0, N);\n    sem_init(&full, 0, 0);\n    pthread_t p, c;\n    pthread_create(&p, NULL, producer, NULL);\n    pthread_create(&c, NULL, consumer, NULL);\n    pthread_join(p, NULL);\n    pthread_join(c, NULL);\n    sem_destroy(&empty);\n    sem_destroy(&full);\n    return 0;\n}\n```\n\nTip interviu: Diferenta mutex vs semafor: mutex-ul este detinut de un thread specific (cel care l-a blocat), semaforul poate fi postat de alt thread."
      },
      {
        "order": 4,
        "title": "Thread-local storage si pthread_once",
        "content": "Thread-local storage (TLS) permite fiecarui thread sa aiba propria copie a unei variabile. In C11 se foloseste _Thread_local, in GCC/Clang __thread.\n\npthread_once() garanteaza ca o functie de initializare se executa o singura data, indiferent de cate thread-uri o apeleaza.\n\nExemplu TLS:\n```c\n#include <pthread.h>\n#include <stdio.h>\n\n__thread int tls_value = 0;  // fiecare thread are copia sa\n\nvoid* thread_func(void* arg) {\n    int id = *(int*)arg;\n    tls_value = id * 100;  // nu afecteaza alte thread-uri\n    printf(\"Thread %d: tls_value = %d\\n\", id, tls_value);\n    return NULL;\n}\n```\n\nExemplu pthread_once (Singleton thread-safe):\n```c\n#include <pthread.h>\n#include <stdio.h>\n#include <stdlib.h>\n\nstatic pthread_once_t init_once = PTHREAD_ONCE_INIT;\nstatic int* shared_resource = NULL;\n\nvoid initialize() {\n    shared_resource = malloc(sizeof(int));\n    *shared_resource = 42;\n    printf(\"Initializat o singura data\\n\");\n}\n\nvoid* worker(void* arg) {\n    pthread_once(&init_once, initialize);\n    printf(\"Valoare: %d\\n\", *shared_resource);\n    return NULL;\n}\n```\n\nExemplu pthread_key (TLS portabil):\n```c\npthread_key_t key;\n\nvoid destructor(void* val) {\n    free(val);  // apelat la terminarea thread-ului\n}\n\n// In main: pthread_key_create(&key, destructor);\n// In thread: pthread_setspecific(key, malloc(100));\n// Citire: void* val = pthread_getspecific(key);\n```\n\nTip interviu: pthread_key este util pentru implementarea de biblioteci care nu pot folosi variabile globale dar au nevoie de context per-thread (ex: errno)."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "Ce flag de compilare este necesar pentru",
        "question": "Ce flag de compilare este necesar pentru a folosi pthreads in GCC?",
        "options": [
          "-pthread sau -lpthread",
          "-thread",
          "-mt",
          "-posix"
        ],
        "answer": "-pthread sau -lpthread",
        "explanation": "GCC necesita -pthread (sau -lpthread pe unele sisteme) pentru a linka biblioteca POSIX threads.",
        "difficulty": "easy"
      },
      {
        "number": 2,
        "name": "Ce se intampla daca nu apelezi pthread_j",
        "question": "Ce se intampla daca nu apelezi pthread_join() sau pthread_detach() pentru un thread?",
        "options": [
          "Thread-ul este oprit automat",
          "Thread-ul devine zombie si resursele nu sunt eliberate",
          "Programul crapa cu segfault",
          "Thread-ul continua sa ruleze dupa terminarea main()"
        ],
        "answer": "Thread-ul devine zombie si resursele nu sunt eliberate",
        "explanation": "Fara join/detach, stack-ul si alte resurse ale thread-ului raman alocate pana la terminarea procesului.",
        "difficulty": "easy"
      },
      {
        "number": 3,
        "name": "Ce este o race condition",
        "question": "Ce este o race condition?",
        "options": [
          "O competitie intre procese pentru CPU",
          "Comportament nedeterminist cauzat de accesul concurent neprotejat la date partajate",
          "O prioritate mai mare a unui thread",
          "O eroare de compilare in cod multithreaded"
        ],
        "answer": "Comportament nedeterminist cauzat de accesul concurent neprotejat la date partajate",
        "explanation": "Race condition apare cand rezultatul depinde de ordinea de executie a thread-urilor, care este nedeterminista.",
        "difficulty": "easy"
      },
      {
        "number": 4,
        "name": "Care este diferenta principala intre un",
        "question": "Care este diferenta principala intre un mutex si un semafor?",
        "options": [
          "Mutex-ul este mai rapid",
          "Mutex-ul are ownership (doar cel care l-a blocat il poate debloca); semaforul nu",
          "Semaforul nu poate depasi valoarea 1",
          "Mutex-ul functioneaza doar in kernel space"
        ],
        "answer": "Mutex-ul are ownership (doar cel care l-a blocat il poate debloca); semaforul nu",
        "explanation": "Un mutex este detinut de thread-ul care l-a locked. Un semafor poate fi postat (incrementat) de orice thread.",
        "difficulty": "easy"
      },
      {
        "number": 5,
        "name": "Ce face sem_wait() cand valoarea semafor",
        "question": "Ce face sem_wait() cand valoarea semaforului este 0?",
        "options": [
          "Returneaza imediat -1",
          "Decrementeaza la -1",
          "Blocheaza thread-ul pana cand valoarea devine pozitiva",
          "Arunca o exceptie"
        ],
        "answer": "Blocheaza thread-ul pana cand valoarea devine pozitiva",
        "explanation": "sem_wait() este o operatie P (proberen): daca valoarea > 0 o decrementeaza, altfel blocheaza.",
        "difficulty": "easy"
      },
      {
        "number": 6,
        "name": "Ce garanteaza pthread_once()",
        "question": "Ce garanteaza pthread_once()?",
        "options": [
          "Ca un thread ruleaza o singura data",
          "Ca o functie de initializare este apelata exact o singura data, chiar si in mediu multi-thread",
          "Ca mutex-ul este initializat o singura data",
          "Ca TLS este alocat o singura data per proces"
        ],
        "answer": "Ca o functie de initializare este apelata exact o singura data, chiar si in mediu multi-thread",
        "explanation": "pthread_once() este echivalentul thread-safe al unui flag de initializare, util pentru singletons.",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "Ce este deadlock",
        "question": "Ce este deadlock?",
        "options": [
          "Un thread care nu se mai termina niciodata",
          "Doua sau mai multe thread-uri blocate fiecare asteptand resurse detinute de celelalte",
          "Un mutex care nu mai poate fi deblocat",
          "O conditie de cursa in codul de initializare"
        ],
        "answer": "Doua sau mai multe thread-uri blocate fiecare asteptand resurse detinute de celelalte",
        "explanation": "Deadlock clasic: T1 detine M1 si vrea M2; T2 detine M2 si vrea M1 â€” ambele se blocheaza infinit.",
        "difficulty": "medium"
      },
      {
        "number": 8,
        "name": "Ce face __thread (sau _Thread_local) ina",
        "question": "Ce face __thread (sau _Thread_local) inaintea unei variabile?",
        "options": [
          "O face constanta",
          "O face accesibila doar din thread-ul main",
          "Creeaza o copie separata a variabilei pentru fiecare thread",
          "O protejeaza automat cu un mutex"
        ],
        "answer": "Creeaza o copie separata a variabilei pentru fiecare thread",
        "explanation": "Thread-local storage (TLS) permite fiecarui thread sa aiba propria instanta a variabilei, fara sincronizare.",
        "difficulty": "medium"
      },
      {
        "number": 9,
        "name": "In pattern-ul Producer-Consumer, la ce s",
        "question": "In pattern-ul Producer-Consumer, la ce serveste semaforul 'empty'?",
        "options": [
          "Semnalizeaza ca buffer-ul este gol",
          "Limiteaza numarul de producatori",
          "Contorizeaza locurile libere din buffer, blocand producatorul cand e plin",
          "Protejeaza accesul la indexul 'out'"
        ],
        "answer": "Contorizeaza locurile libere din buffer, blocand producatorul cand e plin",
        "explanation": "Semaforul 'empty' porneste cu valoarea N (capacitate). Producatorul face sem_wait(&empty) inainte de a scrie â€” se blocheaza cand buffer-ul e plin.",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "Scrie o functie `void parallel_sum(int*",
        "question": "Scrie o functie `void parallel_sum(int* arr, int n, int* result)` care foloseste 2 thread-uri POSIX pentru a calcula suma unui array. Fiecare thread calculeaza jumatate, apoi sumezi rezultatele partiale.",
        "options": [],
        "answer": "",
        "difficulty": "medium",
        "explanation": "Raspunsul corect este: "
      },
      {
        "number": 11,
        "name": "Implementeaza un mutex wrapper: functiil",
        "question": "Implementeaza un mutex wrapper: functiile `void safe_lock(pthread_mutex_t* m)` si `void safe_unlock(pthread_mutex_t* m)` care verifica erorile si afiseaza un mesaj la eroare.",
        "options": [],
        "answer": "",
        "difficulty": "hard",
        "explanation": "Raspunsul corect este: "
      },
      {
        "number": 12,
        "name": "Implementeaza un counter thread-safe: st",
        "question": "Implementeaza un counter thread-safe: structura `SafeCounter` cu un intreg si un mutex, si functiile `void counter_inc(SafeCounter*)` si `int counter_get(SafeCounter*)`.",
        "options": [],
        "answer": "",
        "difficulty": "hard",
        "explanation": "Raspunsul corect este: "
      },
      {
        "number": 13,
        "name": "Scrie un program care porneste 5 thread-",
        "question": "Scrie un program care porneste 5 thread-uri. Fiecare thread afiseaza ID-ul sau (0-4) si incrementeaza un contor global. La final, main() afiseaza valoarea finala a contorului (asteptata: 5).",
        "options": [],
        "answer": "",
        "difficulty": "hard",
        "explanation": "Raspunsul corect este: "
      },
      {
        "number": 14,
        "name": "Scrie functia `void* timed_worker(void*",
        "question": "Scrie functia `void* timed_worker(void* arg)` care primeste un numar de secunde (int*), doarme atat, afiseaza un mesaj si returneaza NULL. In main(), porneste 3 thread-uri cu durate 1, 2, 3 secunde si asteapta-le cu join.",
        "options": [],
        "answer": "",
        "difficulty": "hard",
        "explanation": "Raspunsul corect este: "
      }
    ]
  },
  {
    "slug": "c-signals-process-management",
    "title": "Signals si Process Management in C",
    "order": 33,
    "theory": [
      {
        "order": 1,
        "title": "fork() si exec() â€” crearea proceselor",
        "content": "In Unix, procesele noi sunt create cu fork() (duplica procesul curent) si exec() (inlocuieste imaginea procesului cu un alt program).\n\nfork() returneaza:\n- 0 in procesul copil\n- PID-ul copilului in procesul parinte\n- -1 la eroare\n\nExemplu fork + exec:\n```c\n#include <stdio.h>\n#include <unistd.h>\n#include <sys/wait.h>\n\nint main() {\n    pid_t pid = fork();\n\n    if (pid < 0) {\n        perror(\"fork\");\n        return 1;\n    }\n\n    if (pid == 0) {\n        // Procesul copil\n        printf(\"Copil PID: %d\\n\", getpid());\n        char* args[] = {\"ls\", \"-la\", NULL};\n        execvp(\"ls\", args);  // inlocuieste procesul cu ls\n        perror(\"execvp\");    // ajungem aici doar la eroare\n        return 1;\n    } else {\n        // Procesul parinte\n        printf(\"Parinte PID: %d, Copil PID: %d\\n\",\n               getpid(), pid);\n        int status;\n        waitpid(pid, &status, 0);\n        if (WIFEXITED(status)) {\n            printf(\"Copil terminat cu cod: %d\\n\",\n                   WEXITSTATUS(status));\n        }\n    }\n    return 0;\n}\n```\n\nTip interviu: Procesul zombie apare cand copilul s-a terminat dar parintele nu a apelat wait(). Procesul orfan apare cand parintele moare si copilul este adoptat de init (PID 1)."
      },
      {
        "order": 2,
        "title": "Semnale â€” trimitere si receptie",
        "content": "Semnalele sunt notificari asincrone trimise proceselor. Cele mai comune: SIGINT (Ctrl+C), SIGTERM (terminare gratiosa), SIGKILL (nu poate fi ignorat), SIGSEGV (acces invalid la memorie).\n\nInregistrarea unui handler:\n```c\n#include <stdio.h>\n#include <signal.h>\n#include <unistd.h>\n\nvolatile sig_atomic_t running = 1;\n\nvoid handle_sigint(int sig) {\n    printf(\"\\nSIGINT primit (%d), oprire gratiosa...\\n\", sig);\n    running = 0;\n    // NU apela printf in mod normal in signal handlers!\n    // NU aloca memorie, NU apela functii non-reentrant\n}\n\nint main() {\n    struct sigaction sa = {0};\n    sa.sa_handler = handle_sigint;\n    sigemptyset(&sa.sa_mask);\n    sa.sa_flags = 0;\n    sigaction(SIGINT, &sa, NULL);  // mai bun decat signal()\n\n    printf(\"Ruleaza... (Ctrl+C pentru oprire)\\n\");\n    while (running) {\n        sleep(1);\n        printf(\".\");\n        fflush(stdout);\n    }\n    printf(\"Oprit curat.\\n\");\n    return 0;\n}\n```\n\nTip interviu: volatile sig_atomic_t este necesar pentru variabilele accesate in signal handlers. sigaction() este preferata fata de signal() care are comportament nedefinit pe unele platforme."
      },
      {
        "order": 3,
        "title": "Pipes si comunicarea intre procese",
        "content": "Pipe-urile permit comunicarea unidirectionala intre procese. pipe() creeaza o pereche de file descriptori: [0] pentru citire, [1] pentru scriere.\n\nExemplu pipe parinte-copil:\n```c\n#include <stdio.h>\n#include <unistd.h>\n#include <string.h>\n\nint main() {\n    int pipefd[2];\n    pipe(pipefd);\n    // pipefd[0] = read end\n    // pipefd[1] = write end\n\n    pid_t pid = fork();\n\n    if (pid == 0) {\n        // Copil: citeste din pipe\n        close(pipefd[1]);  // inchide capatul de scriere\n        char buf[256];\n        int n = read(pipefd[0], buf, sizeof(buf)-1);\n        buf[n] = '\\0';\n        printf(\"Copil a primit: %s\\n\", buf);\n        close(pipefd[0]);\n    } else {\n        // Parinte: scrie in pipe\n        close(pipefd[0]);  // inchide capatul de citire\n        char* msg = \"Mesaj de la parinte\";\n        write(pipefd[1], msg, strlen(msg));\n        close(pipefd[1]);  // semnaleaza EOF\n        wait(NULL);\n    }\n    return 0;\n}\n```\n\nPentru comunicare bidirectionala se folosesc 2 pipe-uri sau socketpairs:\n```c\nint sv[2];\nsocketpair(AF_UNIX, SOCK_STREAM, 0, sv);\n// sv[0] si sv[1] pot citi si scrie ambii\n```\n\nTip interviu: Trebuie inchise capetele neutilizate ale pipe-ului in ambele procese, altfel EOF nu este semnalizat (read() nu returneaza 0 cata vreme exista cel putin un writer)."
      },
      {
        "order": 4,
        "title": "Daemon processes si syslog",
        "content": "Un daemon este un proces care ruleaza in background, detasat de terminal. Pasi pentru a crea un daemon:\n\n1. fork() si parintele iese\n2. setsid() â€” creeaza sesiune noua\n3. fork() din nou (optional dar recomandat)\n4. chdir(\"/\") â€” schimba directorul de lucru\n5. umask(0) â€” reseteaza masca de creare fisiere\n6. Inchide fd 0,1,2 si redirectioneaza la /dev/null\n\nExemplu daemon minimal:\n```c\n#include <stdio.h>\n#include <stdlib.h>\n#include <unistd.h>\n#include <sys/stat.h>\n#include <syslog.h>\n\nvoid daemonize() {\n    pid_t pid = fork();\n    if (pid < 0) exit(1);\n    if (pid > 0) exit(0);  // parintele iese\n\n    setsid();  // noul session leader\n\n    // Al doilea fork (optional)\n    pid = fork();\n    if (pid < 0) exit(1);\n    if (pid > 0) exit(0);\n\n    umask(0);\n    chdir(\"/\");\n\n    // Inchide stdandard file descriptori\n    close(0); close(1); close(2);\n\n    // Deschide syslog\n    openlog(\"mydaemon\", LOG_PID, LOG_DAEMON);\n    syslog(LOG_INFO, \"Daemon pornit cu PID %d\", getpid());\n}\n\nint main() {\n    daemonize();\n    while (1) {\n        syslog(LOG_INFO, \"Daemon activ\");\n        sleep(60);\n    }\n    closelog();\n    return 0;\n}\n```\n\nTip interviu: Al doilea fork previne ca procesul sa (re)devina session leader si sa dobandeasca un terminal de control. syslog() este metoda standard de logging pentru daemoni."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "Ce valoare returneaza fork() in procesul",
        "question": "Ce valoare returneaza fork() in procesul copil?",
        "options": [
          "PID-ul parintelui",
          "PID-ul copilului",
          "0",
          "-1"
        ],
        "answer": "0",
        "explanation": "fork() returneaza 0 in copil, PID-ul copilului in parinte, si -1 la eroare.",
        "difficulty": "easy"
      },
      {
        "number": 2,
        "name": "Ce este un proces zombie",
        "question": "Ce este un proces zombie?",
        "options": [
          "Un proces care consuma 100% CPU",
          "Un proces copil terminat al carui status nu a fost colectat de parinte cu wait()",
          "Un proces care ignora SIGTERM",
          "Un daemon care si-a pierdut terminalul"
        ],
        "answer": "Un proces copil terminat al carui status nu a fost colectat de parinte cu wait()",
        "explanation": "Procesul zombie exista in tabela de procese doar ca intrare cu status de iesire, pana cand parintele apeleaza wait().",
        "difficulty": "easy"
      },
      {
        "number": 3,
        "name": "De ce trebuie sa inchizi capetele neutil",
        "question": "De ce trebuie sa inchizi capetele neutilizate ale unui pipe dupa fork()?",
        "options": [
          "Pentru a elibera memorie",
          "Este optional, doar o buna practica",
          "Pentru ca EOF sa fie semnalizat corect â€” read() returneaza 0 doar cand toti writerii au inchis capatul de scriere",
          "Pentru a preveni mostenirea de catre procesele copil"
        ],
        "answer": "Pentru ca EOF sa fie semnalizat corect â€” read() returneaza 0 doar cand toti writerii au inchis capatul de scriere",
        "explanation": "Daca parintele uita sa inchida capatul de scriere al pipe-ului, copilul cititor nu va vedea EOF niciodata.",
        "difficulty": "easy"
      },
      {
        "number": 4,
        "name": "Ce semnal NU poate fi interceptat sau ig",
        "question": "Ce semnal NU poate fi interceptat sau ignorat?",
        "options": [
          "SIGINT",
          "SIGTERM",
          "SIGKILL",
          "SIGUSR1"
        ],
        "answer": "SIGKILL",
        "explanation": "SIGKILL (9) si SIGSTOP nu pot fi interceptate, ignorate sau blocate â€” sunt gestionate direct de kernel.",
        "difficulty": "easy"
      },
      {
        "number": 5,
        "name": "De ce este volatile sig_atomic_t necesar",
        "question": "De ce este volatile sig_atomic_t necesar pentru variabilele din signal handlers?",
        "options": [
          "Previne optimizarile compilatorului care ar putea casha variabila intr-un registru",
          "Face variabila atomica la nivel hardware",
          "Previne accesul din mai multe thread-uri",
          "Este necesara pentru compatibilitate POSIX"
        ],
        "answer": "Previne optimizarile compilatorului care ar putea casha variabila intr-un registru",
        "explanation": "volatile spune compilatorului sa citeasca/scrie mereu din memorie. sig_atomic_t garanteaza ca operatia este atomica (nu poate fi intrerupta de un semnal la mijloc).",
        "difficulty": "easy"
      },
      {
        "number": 6,
        "name": "Ce face setsid() in contextul crearii un",
        "question": "Ce face setsid() in contextul crearii unui daemon?",
        "options": [
          "Seteaza ID-ul sesiunii la o valoare specificata",
          "Creeaza o sesiune noua, detasat de terminalul de control",
          "Seteaza user ID-ul procesului",
          "Salveaza starea procesului"
        ],
        "answer": "Creeaza o sesiune noua, detasat de terminalul de control",
        "explanation": "setsid() face procesul session leader al unei noi sesiuni fara terminal de control â€” necesar pentru un daemon.",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "Ce face WEXITSTATUS(status) dupa waitpid",
        "question": "Ce face WEXITSTATUS(status) dupa waitpid()?",
        "options": [
          "Returneaza semnalul care a terminat procesul",
          "Returneaza codul de iesire al procesului copil (0-255)",
          "Verifica daca procesul a iesit normal",
          "Returneaza PID-ul copilului"
        ],
        "answer": "Returneaza codul de iesire al procesului copil (0-255)",
        "explanation": "WIFEXITED(status) verifica daca procesul a iesit normal; WEXITSTATUS(status) extrage codul de iesire (return value din main sau exit()).",
        "difficulty": "medium"
      },
      {
        "number": 8,
        "name": "Care este diferenta intre execv() si exe",
        "question": "Care este diferenta intre execv() si execvp()?",
        "options": [
          "execvp() cauta programul in PATH, execv() necesita calea completa",
          "execv() este mai rapid",
          "execvp() poate redirecta stdin/stdout",
          "execv() nu inlocuieste imaginea procesului"
        ],
        "answer": "execvp() cauta programul in PATH, execv() necesita calea completa",
        "explanation": "Sufixul 'p' din execvp/execlp inseamna ca se foloseste variabila de mediu PATH pentru a gasi executabilul.",
        "difficulty": "medium"
      },
      {
        "number": 9,
        "name": "Ce este un pipe anonim vs un named pipe",
        "question": "Ce este un pipe anonim vs un named pipe (FIFO)?",
        "options": [
          "Pipe-ul anonim exista doar in memorie si functioneaza intre procese inrudite (parinte-copil); FIFO are o intrare in sistemul de fisiere si poate fi folosit intre procese neinrudite",
          "FIFO este mai rapid",
          "Pipe-ul anonim suporta comunicare bidirectionala",
          "Named pipe necesita drepturi root"
        ],
        "answer": "Pipe-ul anonim exista doar in memorie si functioneaza intre procese inrudite (parinte-copil); FIFO are o intrare in sistemul de fisiere si poate fi folosit intre procese neinrudite",
        "explanation": "mkfifo() creeaza un named pipe vizibil in sistemul de fisiere, utilizabil de orice proces care are permisiuni.",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "Scrie un program care foloseste fork() p",
        "question": "Scrie un program care foloseste fork() pentru a crea un copil. Copilul executa comanda 'ls -l' folosind execvp(). Parintele asteapta copilul cu waitpid() si afiseaza codul de iesire.",
        "options": [],
        "answer": "",
        "difficulty": "medium",
        "explanation": "Raspunsul corect este: "
      },
      {
        "number": 11,
        "name": "Implementeaza un signal handler pentru S",
        "question": "Implementeaza un signal handler pentru SIGTERM care seteaza un flag global `volatile sig_atomic_t should_stop = 0`. In main(), inregistreaza handler-ul cu sigaction() si ruleaza un loop pana cand flag-ul este setat.",
        "options": [],
        "answer": "",
        "difficulty": "hard",
        "explanation": "Raspunsul corect este: "
      },
      {
        "number": 12,
        "name": "Scrie o functie `int run_command(const c",
        "question": "Scrie o functie `int run_command(const char* cmd, char* output, int output_size)` care foloseste popen() pentru a executa o comanda shell si captura output-ul in buffer-ul dat.",
        "options": [],
        "answer": "",
        "difficulty": "hard",
        "explanation": "Raspunsul corect este: "
      },
      {
        "number": 13,
        "name": "Creeaza un program cu pipe care: parinte",
        "question": "Creeaza un program cu pipe care: parintele trimite sirul 'Hello from parent' copilului prin pipe, copilul il citeste, il transforma in uppercase si il trimite inapoi parintelui printr-un al doilea pipe.",
        "options": [],
        "answer": "",
        "difficulty": "hard",
        "explanation": "Raspunsul corect este: "
      },
      {
        "number": 14,
        "name": "Scrie o functie `pid_t spawn_worker(int*",
        "question": "Scrie o functie `pid_t spawn_worker(int* read_fd, int* write_fd)` care creeaza un proces copil cu doua pipe-uri de comunicare bidirectionala si returneaza PID-ul copilului. Parintele va scrie in write_fd si citi din read_fd.",
        "options": [],
        "answer": "",
        "difficulty": "hard",
        "explanation": "Raspunsul corect este: "
      },
      {
        "number": 15,
        "name": "Implementeaza o functie `void ignore_sig",
        "question": "Implementeaza o functie `void ignore_signal(int signum)` care ignora un semnal si `void reset_signal(int signum)` care restaureaza handler-ul default, folosind sigaction().",
        "options": [],
        "answer": "",
        "difficulty": "hard",
        "explanation": "Raspunsul corect este: "
      }
    ]
  },
  {
    "slug": "c-interfata-python",
    "title": "Interfata C cu Python",
    "order": 34,
    "theory": [
      {
        "order": 1,
        "title": "ctypes â€” apelarea bibliotecilor C din Python",
        "content": "ctypes este un modul Python standard care permite apelarea functiilor din biblioteci C partajate (.so/.dll) fara a scrie cod de extensie.\n\nPas 1 â€” Compileaza biblioteca C:\n```bash\ngcc -shared -fPIC -o libmath.so math_funcs.c\n```\n\n```c\n// math_funcs.c\n#include <math.h>\n\ndouble compute_hypotenuse(double a, double b) {\n    return sqrt(a*a + b*b);\n}\n\nint factorial(int n) {\n    return (n <= 1) ? 1 : n * factorial(n-1);\n}\n\nvoid fill_array(int* arr, int n, int value) {\n    for (int i = 0; i < n; i++)\n        arr[i] = value;\n}\n```\n\nFolosire din Python:\n```python\nimport ctypes\n\nlib = ctypes.CDLL(\"./libmath.so\")\n\n# Seteaza tipurile de argumente si return\nlib.compute_hypotenuse.argtypes = [ctypes.c_double, ctypes.c_double]\nlib.compute_hypotenuse.restype = ctypes.c_double\n\nresult = lib.compute_hypotenuse(3.0, 4.0)\nprint(f\"Ipotenuza: {result}\")  # 5.0\n\nlib.factorial.argtypes = [ctypes.c_int]\nlib.factorial.restype = ctypes.c_int\nprint(lib.factorial(10))  # 3628800\n\n# Lucrul cu pointeri\narr = (ctypes.c_int * 5)()\nlib.fill_array.argtypes = [ctypes.POINTER(ctypes.c_int),\n                           ctypes.c_int, ctypes.c_int]\nlib.fill_array(arr, 5, 42)\nprint(list(arr))  # [42, 42, 42, 42, 42]\n```\n\nTip interviu: Intotdeauna seteaza argtypes si restype â€” altfel ctypes presupune ca functia returneaza int si argumentele sunt int, ceea ce poate cauza coruptie de memorie pentru double/pointer."
      },
      {
        "order": 2,
        "title": "cffi â€” alternativa moderna la ctypes",
        "content": "cffi (C Foreign Function Interface) este mai ergonomica decat ctypes si permite scrierea declaratiilor C direct in Python. Suporta doua moduri: ABI (similar ctypes) si API (compileaza un modul de extensie).\n\nModul ABI (in-line):\n```python\nimport cffi\n\nffi = cffi.FFI()\nffi.cdef(\"\"\"\n    double compute_hypotenuse(double a, double b);\n    int factorial(int n);\n    void fill_array(int* arr, int n, int value);\n\"\"\")\n\nlib = ffi.dlopen(\"./libmath.so\")\n\nresult = lib.compute_hypotenuse(3.0, 4.0)\nprint(f\"Ipotenuza: {result}\")  # 5.0\n\n# Aloca un array C din Python\narr = ffi.new(\"int[5]\")\nlib.fill_array(arr, 5, 99)\nprint([arr[i] for i in range(5)])  # [99, 99, 99, 99, 99]\n```\n\nModul API (out-of-line) â€” recomandat pentru productie:\n```python\n# build_ext.py\nimport cffi\nffi = cffi.FFI()\nffi.cdef(\"int factorial(int n);\")\nffi.set_source(\"_mathlib\",\n    '#include \"math_funcs.h\"',\n    sources=[\"math_funcs.c\"])\n\nif __name__ == \"__main__\":\n    ffi.compile(verbose=True)\n\n# Folosire dupa compilare:\nfrom _mathlib import ffi, lib\nprint(lib.factorial(10))\n```\n\nTip interviu: cffi API mode compileaza codul la build time si ofera verificare de tipuri mai stricta si performanta mai buna decat ctypes."
      },
      {
        "order": 3,
        "title": "Extension Modules â€” Python.h",
        "content": "Modulele de extensie Python sunt biblioteci C care implementeaza Python.h API-ul. Permit integrare completa cu tipurile Python.\n\nExemplu modul de extensie:\n```c\n// mymodule.c\n#define PY_SSIZE_T_CLEAN\n#include <Python.h>\n\nstatic PyObject* py_factorial(PyObject* self, PyObject* args) {\n    int n;\n    if (!PyArg_ParseTuple(args, \"i\", &n))\n        return NULL;\n    if (n < 0) {\n        PyErr_SetString(PyExc_ValueError,\n                        \"n trebuie sa fie non-negativ\");\n        return NULL;\n    }\n    long result = 1;\n    for (int i = 2; i <= n; i++)\n        result *= i;\n    return PyLong_FromLong(result);\n}\n\nstatic PyMethodDef MyMethods[] = {\n    {\"factorial\", py_factorial, METH_VARARGS,\n     \"Calculeaza factorialul unui numar.\"},\n    {NULL, NULL, 0, NULL}\n};\n\nstatic struct PyModuleDef mymodule = {\n    PyModuleDef_HEAD_INIT, \"mymodule\", NULL, -1, MyMethods\n};\n\nPyMODINIT_FUNC PyInit_mymodule(void) {\n    return PyModule_Create(&mymodule);\n}\n```\n\nCompilare cu setup.py:\n```python\nfrom distutils.core import setup, Extension\nsetup(name=\"mymodule\",\n      ext_modules=[Extension(\"mymodule\", [\"mymodule.c\"])])\n# python setup.py build_ext --inplace\n```\n\nTip interviu: PyArg_ParseTuple() parseaza argumentele Python. \"i\" = int, \"d\" = double, \"s\" = string, \"O\" = PyObject*. Intotdeauna incrementeaza reference count pentru obiectele returnate cu Py_INCREF sau foloseste functii care o fac automat."
      },
      {
        "order": 4,
        "title": "Structuri si callbacks in ctypes",
        "content": "ctypes suporta structuri C si pointeri la functii (callbacks), permitand interfatarea cu API-uri C mai complexe.\n\nStructuri:\n```c\n// point.h\ntypedef struct {\n    double x, y;\n} Point;\n\ndouble distance(Point a, Point b);\n```\n\n```python\nimport ctypes\nimport math\n\nclass Point(ctypes.Structure):\n    _fields_ = [(\"x\", ctypes.c_double),\n                (\"y\", ctypes.c_double)]\n\nlib = ctypes.CDLL(\"./libpoint.so\")\nlib.distance.argtypes = [Point, Point]\nlib.distance.restype = ctypes.c_double\n\np1 = Point(0.0, 0.0)\np2 = Point(3.0, 4.0)\nprint(lib.distance(p1, p2))  # 5.0\n```\n\nCallbacks (CFUNCTYPE):\n```c\n// sort cu comparator custom\nvoid sort_array(int* arr, int n,\n                int (*compare)(int, int));\n```\n\n```python\nCOMPARATOR = ctypes.CFUNCTYPE(ctypes.c_int,\n                               ctypes.c_int,\n                               ctypes.c_int)\n\ndef my_compare(a, b):\n    return a - b  # ascending\n\ncomp_func = COMPARATOR(my_compare)\n\narr = (ctypes.c_int * 5)(5, 3, 1, 4, 2)\nlib.sort_array(arr, 5, comp_func)\nprint(list(arr))  # [1, 2, 3, 4, 5]\n```\n\nTip interviu: Pastreaza o referinta la obiectul CFUNCTYPE (comp_func) cat timp callback-ul este folosit de cod C â€” Python GC nu stie ca C-ul il mai foloseste si il poate colecta."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "Ce modul Python standard permite apelare",
        "question": "Ce modul Python standard permite apelarea functiilor din .so/.dll fara cod de extensie?",
        "options": [
          "subprocess",
          "ctypes",
          "cffi",
          "cython"
        ],
        "answer": "ctypes",
        "explanation": "ctypes este inclus in biblioteca standard Python si permite apelarea directa a codului C compilat.",
        "difficulty": "easy"
      },
      {
        "number": 2,
        "name": "De ce este important sa setezi argtypes",
        "question": "De ce este important sa setezi argtypes si restype in ctypes?",
        "options": [
          "Este optional, Python ghiceste tipurile",
          "Previne coruptia de memorie si comportamentul nedefinit cauzat de tipuri gresite (ex: double returnat ca int)",
          "Este necesar doar pentru functii cu mai mult de 3 argumente",
          "Imbunatateste doar documentatia codului"
        ],
        "answer": "Previne coruptia de memorie si comportamentul nedefinit cauzat de tipuri gresite (ex: double returnat ca int)",
        "explanation": "Fara argtypes/restype, ctypes presupune c_int pentru tot. O functie care returneaza double va returna bits interpretati ca int.",
        "difficulty": "easy"
      },
      {
        "number": 3,
        "name": "Ce flag GCC este necesar pentru a compil",
        "question": "Ce flag GCC este necesar pentru a compila o biblioteca partajata (.so)?",
        "options": [
          "-static",
          "-shared -fPIC",
          "-dynamic",
          "-lib"
        ],
        "answer": "-shared -fPIC",
        "explanation": "-shared genereaza .so, -fPIC (Position Independent Code) este necesar pentru ca biblioteca sa poata fi incarcata la orice adresa.",
        "difficulty": "easy"
      },
      {
        "number": 4,
        "name": "Ce inseamna flagul -fPIC in compilarea u",
        "question": "Ce inseamna flagul -fPIC in compilarea unei biblioteci partajate?",
        "options": [
          "Fast Position In Cache",
          "Position Independent Code â€” codul poate fi incarcat la orice adresa de memorie",
          "Partial Import Check",
          "Python Integration Compatible"
        ],
        "answer": "Position Independent Code â€” codul poate fi incarcat la orice adresa de memorie",
        "explanation": "O biblioteca partajata este incarcata la adrese diferite in procese diferite. -fPIC genereaza cod care foloseste adresare relativa.",
        "difficulty": "easy"
      },
      {
        "number": 5,
        "name": "In Python Extension Modules (Python.h),",
        "question": "In Python Extension Modules (Python.h), ce face PyArg_ParseTuple cu formatul 'i'?",
        "options": [
          "Parseaza un iterator Python",
          "Parseaza un intreg Python si il converteste la int C",
          "Parseaza un string de index",
          "Verifica daca argumentul este None"
        ],
        "answer": "Parseaza un intreg Python si il converteste la int C",
        "explanation": "Format codes: 'i' = int, 'd' = double, 's' = char*, 'O' = PyObject*, 'l' = long.",
        "difficulty": "easy"
      },
      {
        "number": 6,
        "name": "Ce este CFUNCTYPE in ctypes",
        "question": "Ce este CFUNCTYPE in ctypes?",
        "options": [
          "Un tip pentru functii Python convertite la pointeri la functii C",
          "Un tip pentru structuri C",
          "Un decorator pentru functii Python",
          "O clasa pentru module de extensie"
        ],
        "answer": "Un tip pentru functii Python convertite la pointeri la functii C",
        "explanation": "CFUNCTYPE creeaza un tip care poate impacheta o functie Python ca pointer la functie C, utilizabil ca callback.",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "Care este diferenta principala intre cty",
        "question": "Care este diferenta principala intre ctypes si cffi?",
        "options": [
          "ctypes este mai rapid",
          "cffi permite scrierea declaratiilor C direct si are un mod API care compileaza la build time",
          "cffi nu suporta structuri",
          "ctypes suporta doar Windows"
        ],
        "answer": "cffi permite scrierea declaratiilor C direct si are un mod API care compileaza la build time",
        "explanation": "cffi este mai ergonomic si mai sigur. Modul API compileaza extensia, oferind verificare de tipuri mai buna si performanta superioara.",
        "difficulty": "medium"
      },
      {
        "number": 8,
        "name": "Ce trebuie sa faci cu referinta la CFUNC",
        "question": "Ce trebuie sa faci cu referinta la CFUNCTYPE callback in Python?",
        "options": [
          "Nimic, Python o gestioneaza automat",
          "Sa o stergi dupa utilizare",
          "Sa pastrezi o referinta Python la ea cat timp codul C o foloseste, altfel GC o poate colecta",
          "Sa o converteazi la bytes"
        ],
        "answer": "Sa pastrezi o referinta Python la ea cat timp codul C o foloseste, altfel GC o poate colecta",
        "explanation": "GC-ul Python nu stie ca C-ul mai foloseste callback-ul. Daca variabila Python este colectata, C-ul apeleaza memorie eliberata.",
        "difficulty": "medium"
      },
      {
        "number": 9,
        "name": "Ce macro este folosit pentru a defini fu",
        "question": "Ce macro este folosit pentru a defini functia de initializare a unui modul de extensie Python?",
        "options": [
          "PyMODINIT_FUNC",
          "PYMODULE_INIT",
          "PY_INIT",
          "MODULE_INIT"
        ],
        "answer": "PyMODINIT_FUNC",
        "explanation": "PyMODINIT_FUNC PyInit_<modulename>() este functia apelata de Python la import. Numele trebuie sa se potriveasca cu numele modulului.",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "Scrie o functie C `void reverse_array(in",
        "question": "Scrie o functie C `void reverse_array(int* arr, int n)` care inverseaza un array in-place, si arata cum s-ar apela din Python folosind ctypes (include si codul Python ca comentariu).",
        "options": [],
        "answer": "",
        "difficulty": "medium",
        "explanation": "Raspunsul corect este: "
      },
      {
        "number": 11,
        "name": "Scrie o functie C `double dot_product(do",
        "question": "Scrie o functie C `double dot_product(double* a, double* b, int n)` care calculeaza produsul scalar al doua array-uri. Demonstreaza folosirea din Python cu ctypes (include codul Python ca comentariu).",
        "options": [],
        "answer": "",
        "difficulty": "hard",
        "explanation": "Raspunsul corect este: "
      },
      {
        "number": 12,
        "name": "Scrie un modul de extensie Python comple",
        "question": "Scrie un modul de extensie Python complet pentru o functie `add(a, b)` care aduna doua numere intregi. Include PyArg_ParseTuple, tratarea erorilor si structura PyMethodDef.",
        "options": [],
        "answer": "",
        "difficulty": "hard",
        "explanation": "Raspunsul corect este: "
      },
      {
        "number": 13,
        "name": "Defineste o structura C `typedef struct",
        "question": "Defineste o structura C `typedef struct { float r, g, b; } Color;` si o functie `Color blend(Color a, Color b, float t)` care interpoleaza liniar intre doua culori. Arata definitia ctypes.Structure in Python ca comentariu.",
        "options": [],
        "answer": "",
        "difficulty": "hard",
        "explanation": "Raspunsul corect este: "
      },
      {
        "number": 14,
        "name": "Scrie o functie C `void apply_to_array(i",
        "question": "Scrie o functie C `void apply_to_array(int* arr, int n, int (*func)(int))` care aplica o functie la fiecare element al array-ului. Arata cum se apeleaza din Python cu un callback Python folosind CFUNCTYPE (ca comentariu).",
        "options": [],
        "answer": "",
        "difficulty": "hard",
        "explanation": "Raspunsul corect este: "
      },
      {
        "number": 15,
        "name": "Scrie un modul cffi (ABI mode) in Python",
        "question": "Scrie un modul cffi (ABI mode) in Python care incarca o biblioteca C cu o functie `long fibonacci(int n)` si o apeleaza. Include ffi.cdef() cu declaratia, ffi.dlopen() si apelul functiei.",
        "options": [],
        "answer": "",
        "difficulty": "hard",
        "explanation": "Raspunsul corect este: "
      }
    ]
  },
  {
    "slug": "c-mini-proiect-server-http",
    "title": "Mini Proiect C â€” Server HTTP Simplu",
    "order": 35,
    "theory": [
      {
        "order": 1,
        "title": "Protocolul HTTP/1.0 â€” structura cererii si raspunsului",
        "content": "HTTP (HyperText Transfer Protocol) este protocolul text care sta la baza web-ului. In HTTP/1.0, fiecare conexiune este inchisa dupa un singur request/response.\n\nStructura cererii HTTP:\n```\nGET /index.html HTTP/1.0\\r\\n\nHost: localhost\\r\\n\nConnection: close\\r\\n\n\\r\\n\n```\n\nStructura raspunsului HTTP:\n```\nHTTP/1.0 200 OK\\r\\n\nContent-Type: text/html\\r\\n\nContent-Length: 42\\r\\n\n\\r\\n\n<html><body>Hello World!</body></html>\n```\n\nCoduri de stare comune:\n- 200 OK â€” succes\n- 404 Not Found â€” resursa nu exista\n- 400 Bad Request â€” cerere invalida\n- 500 Internal Server Error â€” eroare server\n\nParsarea cererii in C:\n```c\nvoid parse_request(const char* raw,\n                   char* method,\n                   char* path,\n                   char* version) {\n    sscanf(raw, \"%s %s %s\", method, path, version);\n}\n```\n\nTip interviu: \\r\\n (CRLF) este separatorul de linii in HTTP, nu doar \\n. Headers si body sunt separate de o linie goala (\\r\\n\\r\\n)."
      },
      {
        "order": 2,
        "title": "Servirea fisierelor statice",
        "content": "Un server HTTP de baza trebuie sa mapeze URL-uri la fisiere din sistemul de fisiere si sa le serveasca cu Content-Type corect.\n\n```c\n#include <stdio.h>\n#include <string.h>\n#include <sys/stat.h>\n\nconst char* get_content_type(const char* path) {\n    const char* ext = strrchr(path, '.');\n    if (!ext) return \"application/octet-stream\";\n    if (strcmp(ext, \".html\") == 0) return \"text/html\";\n    if (strcmp(ext, \".css\")  == 0) return \"text/css\";\n    if (strcmp(ext, \".js\")   == 0) return \"application/javascript\";\n    if (strcmp(ext, \".json\") == 0) return \"application/json\";\n    if (strcmp(ext, \".png\")  == 0) return \"image/png\";\n    return \"application/octet-stream\";\n}\n\nint serve_file(int client_fd, const char* path) {\n    // Securitate: previne path traversal\n    if (strstr(path, \"..\")) {\n        char* resp = \"HTTP/1.0 403 Forbidden\\r\\n\\r\\n\";\n        send(client_fd, resp, strlen(resp), 0);\n        return -1;\n    }\n\n    // Construieste calea reala\n    char real_path[512];\n    snprintf(real_path, sizeof(real_path), \"./www%s\", path);\n\n    FILE* f = fopen(real_path, \"rb\");\n    if (!f) {\n        char* resp = \"HTTP/1.0 404 Not Found\\r\\n\"\n                     \"Content-Type: text/plain\\r\\n\\r\\n\"\n                     \"404 Not Found\";\n        send(client_fd, resp, strlen(resp), 0);\n        return -1;\n    }\n\n    struct stat st;\n    stat(real_path, &st);\n    long size = st.st_size;\n\n    char headers[256];\n    snprintf(headers, sizeof(headers),\n        \"HTTP/1.0 200 OK\\r\\n\"\n        \"Content-Type: %s\\r\\n\"\n        \"Content-Length: %ld\\r\\n\\r\\n\",\n        get_content_type(real_path), size);\n    send(client_fd, headers, strlen(headers), 0);\n\n    char buf[4096];\n    size_t n;\n    while ((n = fread(buf, 1, sizeof(buf), f)) > 0)\n        send(client_fd, buf, n, 0);\n\n    fclose(f);\n    return 0;\n}\n```\n\nTip interviu: Sanitizarea path-ului este critica â€” fara verificarea \"..\" un atacator poate citi orice fisier de pe server (path traversal attack)."
      },
      {
        "order": 3,
        "title": "Concurenta cu fork() per conexiune",
        "content": "Un server simplu cu fork() creeaza un proces nou pentru fiecare conexiune. Este simplu dar costisitor. Alternativele sunt thread-pool sau I/O multiplexing (epoll).\n\n```c\n#include <stdio.h>\n#include <unistd.h>\n#include <sys/socket.h>\n#include <sys/wait.h>\n#include <signal.h>\n\nvoid reap_children(int sig) {\n    // Evita zombie-uri\n    while (waitpid(-1, NULL, WNOHANG) > 0);\n}\n\nvoid run_server(int server_fd) {\n    // Handler pentru SIGCHLD\n    struct sigaction sa = {0};\n    sa.sa_handler = reap_children;\n    sa.sa_flags = SA_RESTART;\n    sigaction(SIGCHLD, &sa, NULL);\n\n    while (1) {\n        struct sockaddr_in client_addr;\n        socklen_t len = sizeof(client_addr);\n        int client_fd = accept(server_fd,\n            (struct sockaddr*)&client_addr, &len);\n        if (client_fd < 0) continue;\n\n        pid_t pid = fork();\n        if (pid == 0) {\n            // Proces copil: gestioneaza cererea\n            close(server_fd);     // copilul nu asculta\n            handle_request(client_fd);\n            close(client_fd);\n            _exit(0);             // nu apela atexit handlers\n        } else {\n            // Parinte: continua sa asculte\n            close(client_fd);     // parintele nu vorbeste cu clientul\n        }\n    }\n}\n```\n\nTip interviu: _exit() vs exit() â€” _exit() nu apeleaza functiile atexit() sau flush-ul stdout, util in procesul copil pentru a evita dublarea efectelor."
      },
      {
        "order": 4,
        "title": "Thread pool pentru server HTTP performant",
        "content": "Un thread pool pre-creeaza un numar fix de thread-uri care iau cereri dintr-o coada. Elimina overhead-ul de creare/distrugere per conexiune.\n\n```c\n#include <pthread.h>\n#include <stdio.h>\n\n#define POOL_SIZE 8\n#define QUEUE_SIZE 128\n\ntypedef struct {\n    int fds[QUEUE_SIZE];\n    int head, tail, count;\n    pthread_mutex_t lock;\n    pthread_cond_t  not_empty;\n    pthread_cond_t  not_full;\n} WorkQueue;\n\nWorkQueue queue = {.head=0, .tail=0, .count=0,\n                   .lock=PTHREAD_MUTEX_INITIALIZER,\n                   .not_empty=PTHREAD_COND_INITIALIZER,\n                   .not_full=PTHREAD_COND_INITIALIZER};\n\nvoid queue_push(int fd) {\n    pthread_mutex_lock(&queue.lock);\n    while (queue.count == QUEUE_SIZE)\n        pthread_cond_wait(&queue.not_full, &queue.lock);\n    queue.fds[queue.tail] = fd;\n    queue.tail = (queue.tail + 1) % QUEUE_SIZE;\n    queue.count++;\n    pthread_cond_signal(&queue.not_empty);\n    pthread_mutex_unlock(&queue.lock);\n}\n\nint queue_pop() {\n    pthread_mutex_lock(&queue.lock);\n    while (queue.count == 0)\n        pthread_cond_wait(&queue.not_empty, &queue.lock);\n    int fd = queue.fds[queue.head];\n    queue.head = (queue.head + 1) % QUEUE_SIZE;\n    queue.count--;\n    pthread_cond_signal(&queue.not_full);\n    pthread_mutex_unlock(&queue.lock);\n    return fd;\n}\n\nvoid* worker_thread(void* arg) {\n    while (1) {\n        int fd = queue_pop();\n        handle_request(fd);\n        close(fd);\n    }\n    return NULL;\n}\n\nvoid start_thread_pool() {\n    pthread_t threads[POOL_SIZE];\n    for (int i = 0; i < POOL_SIZE; i++)\n        pthread_create(&threads[i], NULL, worker_thread, NULL);\n}\n```\n\nTip interviu: Thread pool vs fork per request: thread pool este mai eficient (fara overhead de creare proces, memorie partajata), dar necesita sincronizare atenta. Apache foloseste MPM prefork (procese), nginx foloseste event loop (I/O multiplexing)."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "Ce secventa de caractere separa header-e",
        "question": "Ce secventa de caractere separa header-ele HTTP de body?",
        "options": [
          "\\n\\n",
          "\\r\\n\\r\\n",
          "\\r\\n",
          "---"
        ],
        "answer": "\\r\\n\\r\\n",
        "explanation": "HTTP foloseste CRLF (\\r\\n) ca separator de linii. O linie goala (\\r\\n\\r\\n) separa headers de body.",
        "difficulty": "easy"
      },
      {
        "number": 2,
        "name": "Ce vulnerabilitate de securitate previi",
        "question": "Ce vulnerabilitate de securitate previi verificand ca path-ul nu contine '..'?",
        "options": [
          "SQL Injection",
          "Buffer Overflow",
          "Path Traversal Attack â€” accesul la fisiere din afara directorului web",
          "Cross-Site Scripting (XSS)"
        ],
        "answer": "Path Traversal Attack â€” accesul la fisiere din afara directorului web",
        "explanation": "Fara validare, un request GET /../../../etc/passwd ar putea permite citirea fisierelor sensibile ale sistemului.",
        "difficulty": "easy"
      },
      {
        "number": 3,
        "name": "De ce folosim _exit(0) in procesul copil",
        "question": "De ce folosim _exit(0) in procesul copil al serverului fork-based in loc de exit(0)?",
        "options": [
          "_exit() este mai rapida",
          "exit() ar apela functiile atexit() si ar face flush bufferelor stdio â€” efecte care nu trebuie duplicate in copil",
          "_exit() inchide automat toate socket-urile",
          "exit() nu functioneaza in procesele copil"
        ],
        "answer": "exit() ar apela functiile atexit() si ar face flush bufferelor stdio â€” efecte care nu trebuie duplicate in copil",
        "explanation": "_exit() termina procesul direct fara cleanups la nivel de biblioteca C, evitand efecte secundare nedorite.",
        "difficulty": "easy"
      },
      {
        "number": 4,
        "name": "Ce rol are SIGCHLD handler cu WNOHANG in",
        "question": "Ce rol are SIGCHLD handler cu WNOHANG in serverul fork-based?",
        "options": [
          "Opreste serverul la SIGCHLD",
          "Colecteaza procesele copil terminate pentru a preveni zombie-urile",
          "Trimite un semnal copilului",
          "Blocheaza pana cand copilul se termina"
        ],
        "answer": "Colecteaza procesele copil terminate pentru a preveni zombie-urile",
        "explanation": "WNOHANG in waitpid() inseamna 'nu bloca daca nu exista copii terminati'. Loop-ul colecteaza toti copiii terminati fara a bloca serverul.",
        "difficulty": "easy"
      },
      {
        "number": 5,
        "name": "Care este avantajul principal al thread",
        "question": "Care este avantajul principal al thread pool fata de fork per request?",
        "options": [
          "Thread pool suporta mai multe protocoale",
          "Thread pool elimina overhead-ul de creare/distrugere per conexiune si permite partajarea memoriei",
          "Fork per request este mai sigur la crashes",
          "Thread pool este mai usor de implementat"
        ],
        "answer": "Thread pool elimina overhead-ul de creare/distrugere per conexiune si permite partajarea memoriei",
        "explanation": "Crearea unui proces/thread are cost. Pool-ul pre-creeaza thread-uri care reutilizeaza conexiunile, reducand latenta si consumul de resurse.",
        "difficulty": "easy"
      },
      {
        "number": 6,
        "name": "Ce inseamna SA_RESTART in sa_flags pentr",
        "question": "Ce inseamna SA_RESTART in sa_flags pentru sigaction?",
        "options": [
          "Restarteaza handler-ul dupa fiecare semnal",
          "Restarteaza automat apelurile de sistem intrerupte de semnal (EINTR)",
          "Reporneste procesul la semnalare",
          "Inregistreaza handler-ul o singura data"
        ],
        "answer": "Restarteaza automat apelurile de sistem intrerupte de semnal (EINTR)",
        "explanation": "Fara SA_RESTART, un semnal poate intrerupe accept() cu EINTR. Cu SA_RESTART, kernel-ul reincearca automat apelul de sistem.",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "De ce trebuie parintele sa inchida clien",
        "question": "De ce trebuie parintele sa inchida client_fd dupa fork() in serverul fork-based?",
        "options": [
          "Pentru a elibera memorie",
          "Pentru ca descriptorul duplicat sa nu mentina conexiunea deschisa si sa consume resurse",
          "Este optional",
          "Pentru a preveni parintele sa citeasca date destinate copilului"
        ],
        "answer": "Pentru ca descriptorul duplicat sa nu mentina conexiunea deschisa si sa consume resurse",
        "explanation": "fork() duplica toti file descriptorii. Daca parintele nu inchide client_fd, conexiunea ramane deschisa chiar si dupa ce copilul o inchide.",
        "difficulty": "medium"
      },
      {
        "number": 8,
        "name": "Ce face Content-Length in header-ul unui",
        "question": "Ce face Content-Length in header-ul unui raspuns HTTP?",
        "options": [
          "Seteaza limita maxima de request",
          "Specifica dimensiunea in bytes a body-ului, permitand clientului sa stie cand s-a terminat transmisia",
          "Seteaza timeout-ul conexiunii",
          "Indica numarul de header-e"
        ],
        "answer": "Specifica dimensiunea in bytes a body-ului, permitand clientului sa stie cand s-a terminat transmisia",
        "explanation": "Fara Content-Length in HTTP/1.0, clientul citeste pana la inchiderea conexiunii. In HTTP/1.1, este necesar pentru keep-alive.",
        "difficulty": "medium"
      },
      {
        "number": 9,
        "name": "Ce inseamna SA_RESTART in sa_flags pentr",
        "question": "Ce inseamna SA_RESTART in sa_flags pentru sigaction?",
        "options": [
          "Reinregistreaza handler-ul automat",
          "Restarteaza apelurile de sistem intrerupte (EINTR) automat",
          "Reporneste daemon-ul",
          "Salveaza starea la restart"
        ],
        "answer": "Restarteaza apelurile de sistem intrerupte (EINTR) automat",
        "explanation": "SA_RESTART face ca syscall-urile intrerupte de semnal (ex: accept, recv) sa fie reluate automat in loc sa returneze EINTR.",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "Scrie o functie `void parse_http_request",
        "question": "Scrie o functie `void parse_http_request(const char* raw, char* method, char* path)` care extrage metoda HTTP (GET, POST etc.) si calea din primul rand al cererii.",
        "options": [],
        "answer": "",
        "difficulty": "medium",
        "explanation": "Raspunsul corect este: "
      },
      {
        "number": 11,
        "name": "Scrie o functie `void send_404(int fd)`",
        "question": "Scrie o functie `void send_404(int fd)` care trimite un raspuns HTTP 404 Not Found complet (status line, headers Content-Type si Content-Length, si body HTML cu mesajul de eroare).",
        "options": [],
        "answer": "",
        "difficulty": "hard",
        "explanation": "Raspunsul corect este: "
      },
      {
        "number": 12,
        "name": "Scrie o functie `const char* mime_type(c",
        "question": "Scrie o functie `const char* mime_type(const char* filename)` care returneaza MIME type-ul corect bazat pe extensia fisierului (html, css, js, json, png, jpg, gif, ico, txt).",
        "options": [],
        "answer": "",
        "difficulty": "hard",
        "explanation": "Raspunsul corect este: "
      },
      {
        "number": 13,
        "name": "Scrie o functie `int is_safe_path(const",
        "question": "Scrie o functie `int is_safe_path(const char* path)` care returneaza 1 daca path-ul este sigur (nu contine '..', nu incepe cu '/', nu contine caractere nule) si 0 altfel.",
        "options": [],
        "answer": "",
        "difficulty": "hard",
        "explanation": "Raspunsul corect este: "
      },
      {
        "number": 14,
        "name": "Scrie functia `void handle_request(int c",
        "question": "Scrie functia `void handle_request(int client_fd)` pentru serverul HTTP: citeste cererea cu recv(), parseaza metoda si path-ul, si daca metoda este GET apeleaza serve_file(), altfel trimite 405 Method Not Allowed.",
        "options": [],
        "answer": "",
        "difficulty": "hard",
        "explanation": "Raspunsul corect este: "
      },
      {
        "number": 15,
        "name": "Scrie functia `void run_http_server(int",
        "question": "Scrie functia `void run_http_server(int port)` care porneste un server HTTP pe portul dat, accepta conexiuni in loop si le trateaza cu handle_request() intr-un proces copil (fork). Adauga si handler SIGCHLD pentru zombie prevention.",
        "options": [],
        "answer": "",
        "difficulty": "hard",
        "explanation": "Raspunsul corect este: "
      }
    ]
  }
];

module.exports = { cExtra3 };
