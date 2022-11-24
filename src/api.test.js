import Supertest from 'supertest'
import chai from 'chai'

const expect = chai.expect;
const requester = Supertest('http://localhost:8080')

describe('products testing', () =>{

    describe('GETS', () =>{
        it('Could return status 200', async()=>{
            let response = await requester.get('/api/products')
            expect(response.status).to.be.equal(200)
        })
    })

    describe('POSTS', () => {
        it('Add Product', async()=>{
            const newproduct ={
                name:"Liofilizado Clásico Doypack",
                price:100,
                stock:100,
                brand:"Juan Valdez",
                country:"Colombia",
                description:"Juan Valdez Liofilizado Clásico Doypack Colombia"
            }
            const response = await requester.post('/api/products').send(newproduct);
            expect(response.status).to.be.equal(200)
        })
    })
    describe('PUT', () => {
        it('Update Product', async()=>{
            const update ={
                price:150,
                stock:500,
            }
            const response = await requester.put('/api/products/5').send(update);
            expect(response.status).to.be.equal(200)
        })

        it('Verify product price update', async()=>{
            const update = {
                price:150,
                stock:500,
            }
            const response = await requester.put('/api/products/5').send(update);
            const product = response._body.product

            expect(product.price).to.be.equal(update.price)
        })

        it('Verify product stock update', async()=>{
            const update = {
                price:150,
                stock:500,
            }

            const response = await requester.put('/api/products/5').send(update);
            const product = response._body.product

            expect(product.stock).to.be.equal(update.stock)
        })
    })
    describe('DELETE', () =>{
        it('Delete Product', async()=>{
            let response = await requester.delete('/api/products/7')
            expect(response.status).to.be.equal(200)
        })
    })
})