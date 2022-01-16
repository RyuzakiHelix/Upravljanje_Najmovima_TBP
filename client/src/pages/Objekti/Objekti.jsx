import React, {useState, useEffect} from 'react'
import {Card, Nav, Container, Table, Button} from 'react-bootstrap'
import Cookies from 'universal-cookie';

const Objekti = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [podaci, setPodaci] = useState();
    const [odabrani, setOdabrani] = useState();
    const cookies = new Cookies();
    async function dohvatiPodatke(){
        const podaci= await fetch('http://localhost:3001/objekt', {
             method:'GET',
             mode: "cors",
             headers:{'Content-Type':'application/json',
            'access_token': cookies.get('access_token')}
            
         });
         if(podaci.status===200){
         const response = await podaci.json();
         setPodaci(response);
         setIsLoading(true);
         }
        }
        useEffect(()=>{
        dohvatiPodatke();
        }, [])

        async function unajmi(objektID){
            const unajmi= await fetch('http://localhost:3001/unajmi', {
             method:'POST',
             mode: "cors",
             headers:{'Content-Type':'application/json',
            'access_token': cookies.get('access_token')},
            body: JSON.stringify({
                objektID
            })
         });

        }
    return (
        <>
        {isLoading ? (
        <Table striped bordered hover variant="dark">
        <thead>
            <tr>
              <th>#</th>
              <th>Adresa objekta</th>
              <th>Postanski broj</th>
              <th>Vrsta objekta</th>
              <th>Vlasnik</th>
              <th>Kontakt vlasnika</th>
              <th>Cijena najma</th>
              <th>#</th>
            </tr>
          </thead>
          <tbody>

    
            {podaci.map((pod, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{pod.adresa}</td>
                  <td>{pod.postanski_broj}</td>
                  <td>{pod.naziv}</td>
                  <td>{pod.ime_prezime.split('_')[0].toUpperCase() + " " + pod.ime_prezime.split('_')[1].toUpperCase()}</td>
                  <td>{pod.email}</td>
                  <td>{pod.cijena}</td>
                  <td><Button onClick={() => {unajmi(pod.id_objekt)}}>Unajmi</Button></td>
                </tr>
              )
            })}
            
          </tbody>
        </Table>) 
        
        : (<div>Podaci</div>)}
        </>
    )
}

export default Objekti
