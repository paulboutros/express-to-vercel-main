export default class QueryStore{
 
    constructor(){

        this.queries = [

            {
                id:"123",
                dna:"TI:HEAD::Wolf"
            },

            {
                id:"456",
                dna:"TI:HEAD::Bear"
            },

            {
                id:"789",
                dna:"TI:BODY::Armor"
            }

        ];

    }

    
    async initialize(api_getQueryExample){

       const map = await api_getQueryExample({});

       this.setQueries(map["examples"]);

    }
 
    setQueries(savedQueryJson){ 
         this.queries = Object.values(savedQueryJson).filter(query =>
            query.queryMode === "DSL" ||
            query.queryMode === "NFT_SEARCH"
        );; 
    }

     getRecent(){

        return this.queries;

    }

    search(text){

        text = text.toLowerCase();

        return this.queries.filter(  q=>q.raw.toLowerCase().includes(text)  );

            

       

    }
 
 

    getFavorites(){

    }

    save(dna){

    }

    delete(id){

    }

}