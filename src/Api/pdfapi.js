import React, { useCallback, useEffect, useState } from 'react';
import { todoapi } from './todos';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import "bootstrap-icons/font/bootstrap-icons.css";

function Pdf() {
    const [apidata, setApidata] = useState(null);
    const [loading, setLoading] = useState(false);

    const apiData = useCallback(async () => {
        setLoading(false)
        const response = await fetch(todoapi);
        const data = await response.json();
        setApidata(data)
        setLoading(true)
    }, [apidata])

    useEffect(() => {
        apiData();
    }, [])

    const single_pdf = (id) => {
        console.log(id)
        const confirm = window.confirm("Are you sure to download this pdf file");
        if (!apidata) {
            console.error('No data available for PDF generation');
            return;
        }
        if(confirm){
        const doc = new jsPDF();
        const columns = Object.keys(apidata[0]);
        console.log(columns)

        let rows = apidata.filter((data) => data.id === id);
        const userdata = rows.map((items) => Object.values(items));
        console.log(userdata)

        // Add table to PDF
        doc.autoTable({
            head: [columns],
            body: userdata,
        });

        doc.save(`${rows[0].title}.pdf`);
    }
}
    const pdfgenarator = () => {
        if (!apidata) {
            console.error('No data available for PDF generation');
            return;
        }
       if(window.confirm("Are you sure to download this pdf file")){
        const doc = new jsPDF();
        // All data in pdf
        
        const columns = Object.keys(apidata[0]);
        const rows = apidata.map((data) => Object.values(data));

        // Add table to PDF
        doc.autoTable({
            head: [columns],
            body: rows,
        });

        doc.save(`alldata.pdf`);
    }
}
    return (
        <>
            <button type='button' className="btn btn-success" onClick={() => pdfgenarator()}>Pdf</button>
                <div className='mx-auto w-75 table_style'>
                    <table className="table table-dark" style={{width:`calc(100% - 6px)`}}>
                        <thead>
                            <tr>
                                <th scope="col">S.no</th>
                                <th scope="col">Title</th>
                                <th scope="col">Completed</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            !loading ? <h1>Loading....</h1> :
                                apidata && apidata.map((items, index) => {
                                    console.log(items.completed)
                                    return (

                                            <tr>
                                                <th scope="row" key={items.id}>{items.id}</th>
                                                <td>{items.title}</td>
                                                <td>{items.completed.toString()}</td>
                                                <td className= 'text-center position-relative'> 
                                                {
                                                     items.completed.toString() === "true" ?
                                                    <i className="bi bi-filetype-pdf myDiv" style={{cursor:'pointer'}} onClick={() => single_pdf((items.id))}></i>
                                                    :
                                                    <i disabled="disabled" className="bi bi-filetype-pdf myDiv Disabled" style={{cursor:'pointer'}} onClick={() => single_pdf((items.id))}></i>
                                                }
                                              <div className= "hide" style={{zIndex:"2",  position: "absolute", bottom: "46px", left: "2px", fontSize: 12, backgroundColor: "wheat", whiteSpace: "nowrap", padding: "6px", color: "white", boxShadow: "inset 3px 33px black, 0em 0 .4em olive" }}>Download pdf<svg width="1em" height="1em" viewBox="0 0 16 16" class="position-absolute top-100 start-50 translate-middle mt-1 bi bi-caret-down-fill" fill="#fff" xmlns="http://www.w3.org/2000/svg"><path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" /></svg></div>
                                             
                                                </td>
                                            </tr>
                                    )
                                })
                            }
                            </tbody>
                    </table>
                </div>
        </>
    )

}

export default Pdf