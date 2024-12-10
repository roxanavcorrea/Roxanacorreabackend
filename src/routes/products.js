import { authorizeRole } from '../middlewares/authorization.js';

router.post('/', passport.authenticate('current', { session: false }), authorizeRole('admin'), async (req, res) => {
    // crea un producto
});

router.put('/:id', passport.authenticate('current', { session: false }), authorizeRole('admin'), async (req, res) => {
    // actualiza un producto
});

router.delete('/:id', passport.authenticate('current', { session: false }), authorizeRole('admin'), async (req, res) => {
    // elimina un producto
});
