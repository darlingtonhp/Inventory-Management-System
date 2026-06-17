<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Permission;
use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\Inventory;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\SalesOrder;
use App\Models\SalesOrderItem;
use App\Models\StockMovement;
use App\Models\Setting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Roles
        $roles = [
            'admin' => 'Administrator',
            'manager' => 'Inventory Manager',
            'warehouse_staff' => 'Warehouse Staff',
            'purchasing_officer' => 'Purchasing Officer',
            'sales_staff' => 'Sales Staff',
            'viewer' => 'Read-Only Viewer',
        ];

        $roleModels = [];
        foreach ($roles as $slug => $name) {
            $roleModels[$slug] = Role::create([
                'name' => $name,
                'slug' => $slug,
            ]);
        }

        // 2. Seed Permissions
        $modules = ['catalog', 'suppliers', 'purchasing', 'sales', 'stock', 'reports', 'admin'];
        
        foreach ($roleModels as $slug => $role) {
            foreach ($modules as $module) {
                $canView = false;
                $canCreate = false;
                $canEdit = false;
                $canDelete = false;

                if ($slug === 'admin') {
                    $canView = $canCreate = $canEdit = $canDelete = true;
                } elseif ($slug === 'manager') {
                    $canView = $canCreate = $canEdit = $canDelete = ($module !== 'admin');
                } elseif ($slug === 'warehouse_staff') {
                    $canView = in_array($module, ['catalog', 'purchasing', 'sales', 'stock', 'reports']);
                    $canCreate = in_array($module, ['stock']); // only adjustments
                    $canEdit = false;
                    $canDelete = false;
                } elseif ($slug === 'purchasing_officer') {
                    $canView = in_array($module, ['catalog', 'suppliers', 'purchasing', 'stock']);
                    $canCreate = in_array($module, ['suppliers', 'purchasing']);
                    $canEdit = in_array($module, ['suppliers', 'purchasing']);
                } elseif ($slug === 'sales_staff') {
                    $canView = in_array($module, ['catalog', 'sales', 'stock']);
                    $canCreate = in_array($module, ['sales']);
                    $canEdit = in_array($module, ['sales']);
                } elseif ($slug === 'viewer') {
                    $canView = ($module !== 'admin');
                }

                Permission::create([
                    'role_id' => $role->id,
                    'module' => $module,
                    'can_view' => $canView,
                    'can_create' => $canCreate,
                    'can_edit' => $canEdit,
                    'can_delete' => $canDelete,
                ]);
            }
        }

        // 3. Seed Users
        $password = bcrypt('Test123*');
        
        // Admin user requested in README & original setup
        $testUser = User::create([
            'name' => 'System Admin',
            'email' => 'test@user.com',
            'password' => $password,
            'role_id' => $roleModels['admin']->id,
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        $users = [
            ['name' => 'Manager User', 'email' => 'manager@user.com', 'role' => 'manager'],
            ['name' => 'Warehouse operator', 'email' => 'warehouse@user.com', 'role' => 'warehouse_staff'],
            ['name' => 'Purchasing Officer', 'email' => 'purchasing@user.com', 'role' => 'purchasing_officer'],
            ['name' => 'Sales Representative', 'email' => 'sales@user.com', 'role' => 'sales_staff'],
            ['name' => 'Executive Viewer', 'email' => 'viewer@user.com', 'role' => 'viewer'],
        ];

        foreach ($users as $u) {
            User::create([
                'name' => $u['name'],
                'email' => $u['email'],
                'password' => $password,
                'role_id' => $roleModels[$u['role']]->id,
                'is_active' => true,
                'email_verified_at' => now(),
            ]);
        }

        // 4. Seed Categories
        $categoriesData = [
            ['name' => 'Electronics', 'desc' => 'Gargets, laptops, and mobile devices.', 'children' => ['Laptops', 'Mobile Phones', 'Accessories']],
            ['name' => 'Furniture', 'desc' => 'Office and warehouse furniture items.', 'children' => ['Desks', 'Chairs', 'Shelving']],
            ['name' => 'Stationery', 'desc' => 'Writing equipment, paper and printer inks.', 'children' => ['Paper', 'Pens', 'Cartridges']],
            ['name' => 'Apparel', 'desc' => 'Safety wear and team uniforms.', 'children' => ['Safety Vests', 'Gloves', 'Boots']],
        ];

        $categoryModels = [];
        foreach ($categoriesData as $cat) {
            $parent = Category::create([
                'name' => $cat['name'],
                'description' => $cat['desc'],
                'parent_id' => null,
            ]);
            $categoryModels[] = $parent;
            foreach ($cat['children'] as $childName) {
                Category::create([
                    'name' => $childName,
                    'description' => $childName . ' sub-category.',
                    'parent_id' => $parent->id,
                ]);
            }
        }

        // List of all leaf/active categories for products
        $leafCategories = Category::whereNotNull('parent_id')->get();

        // 5. Seed Suppliers
        $suppliersData = [
            ['name' => 'Globex Corporation', 'contact' => 'Hank Scorpio', 'email' => 'hank@globex.com', 'phone' => '+1-555-0199', 'address' => 'Cypress Creek', 'terms' => 'Net 30'],
            ['name' => 'Acme Suppliers Co', 'contact' => 'Wile E. Coyote', 'email' => 'wile@acme.com', 'phone' => '+1-555-0122', 'address' => 'Desert Plains Road', 'terms' => 'Cash on Delivery'],
            ['name' => 'Nexus Logistics', 'contact' => 'Sarah Connor', 'email' => 'sconnor@nexus.com', 'phone' => '+1-555-0145', 'address' => 'Tech Park Dr, LA', 'terms' => 'Net 15'],
            ['name' => 'Apex Distributing', 'contact' => 'Bruce Wayne', 'email' => 'bwayne@apex.com', 'phone' => '+1-555-0188', 'address' => 'Wayne Tower, Gotham', 'terms' => 'Net 60'],
        ];

        $supplierModels = [];
        foreach ($suppliersData as $sup) {
            $supplierModels[] = Supplier::create([
                'name' => $sup['name'],
                'contact_person' => $sup['contact'],
                'email' => $sup['email'],
                'phone' => $sup['phone'],
                'address' => $sup['address'],
                'payment_terms' => $sup['terms'],
                'is_active' => true,
            ]);
        }

        // 6. Seed Products
        $productsData = [
            ['name' => 'ProBook Laptop 15"', 'prefix' => 'LAP', 'unit' => 'pcs', 'cost' => 450.00, 'sell' => 699.99, 'reorder' => 5],
            ['name' => 'SmartPhone X10', 'prefix' => 'MOB', 'unit' => 'pcs', 'cost' => 200.00, 'sell' => 349.99, 'reorder' => 8],
            ['name' => 'Bluetooth Earbuds v5', 'prefix' => 'ACC', 'unit' => 'pcs', 'cost' => 15.00, 'sell' => 39.99, 'reorder' => 20],
            ['name' => 'Ergonomic Desk Chair', 'prefix' => 'CHR', 'unit' => 'pcs', 'cost' => 75.00, 'sell' => 129.99, 'reorder' => 4],
            ['name' => 'Adjustable Steel Shelving', 'prefix' => 'SHV', 'unit' => 'pcs', 'cost' => 40.00, 'sell' => 79.99, 'reorder' => 3],
            ['name' => 'A4 Copier Paper Box', 'prefix' => 'PAP', 'unit' => 'box', 'cost' => 12.00, 'sell' => 22.50, 'reorder' => 15],
            ['name' => 'Gel Pens Black (Pack 10)', 'prefix' => 'PEN', 'unit' => 'pcs', 'cost' => 2.50, 'sell' => 5.99, 'reorder' => 30],
            ['name' => 'High-Visibility Safety Vest', 'prefix' => 'VST', 'unit' => 'pcs', 'cost' => 4.00, 'sell' => 9.99, 'reorder' => 12],
            ['name' => 'Heavy Duty Leather Gloves', 'prefix' => 'GLV', 'unit' => 'pair', 'cost' => 6.00, 'sell' => 14.50, 'reorder' => 10],
            ['name' => 'Steel-Toe Safety Boots', 'prefix' => 'BOT', 'unit' => 'pair', 'cost' => 35.00, 'sell' => 69.99, 'reorder' => 5],
        ];

        $productModels = [];
        foreach ($productsData as $index => $prod) {
            $cat = $leafCategories->random();
            $sku = strtoupper($prod['prefix']) . '-' . str_pad($index + 1, 4, '0', STR_PAD_LEFT);
            
            $product = Product::create([
                'category_id' => $cat->id,
                'name' => $prod['name'],
                'sku' => $sku,
                'unit' => $prod['unit'],
                'cost_price' => $prod['cost'],
                'selling_price' => $prod['sell'],
                'reorder_level' => $prod['reorder'],
                'max_level' => $prod['reorder'] * 5,
                'status' => 'Active',
            ]);

            $productModels[] = $product;

            // Link to 1 or 2 suppliers
            $suppliersToLink = collect($supplierModels)->random(rand(1, 2));
            foreach ($suppliersToLink as $sup) {
                $product->suppliers()->attach($sup->id);
            }

            // 7. Seed Inventory table (Quantities on Hand)
            $qtyOnHand = rand(3, 40);
            
            Inventory::create([
                'product_id' => $product->id,
                'quantity_on_hand' => $qtyOnHand,
                'quantity_reserved' => 0,
                'last_updated' => now(),
            ]);

            // Create initial Stock Movement (Opening Stock Adjustment)
            StockMovement::create([
                'product_id' => $product->id,
                'type' => 'Adjustment',
                'quantity' => $qtyOnHand,
                'notes' => 'Initial opening inventory load.',
                'user_id' => $testUser->id,
            ]);
        }

        // 8. Seed sample Purchase Orders
        for ($i = 1; $i <= 3; $i++) {
            $sup = collect($supplierModels)->random();
            $po = PurchaseOrder::create([
                'supplier_id' => $sup->id,
                'reference' => 'PO-' . date('Y') . '-' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'status' => $i === 1 ? 'Fully Received' : ($i === 2 ? 'Submitted' : 'Draft'),
                'order_date' => now()->subDays(5 * $i),
                'expected_date' => now()->addDays(5),
                'notes' => 'Auto-seeded purchase order.',
                'created_by' => $testUser->id,
            ]);

            // Add 2-3 items
            $productsForPO = collect($productModels)->random(rand(2, 3));
            foreach ($productsForPO as $prod) {
                $qtyOrdered = rand(10, 50);
                $qtyReceived = ($po->status === 'Fully Received') ? $qtyOrdered : 0;
                
                PurchaseOrderItem::create([
                    'purchase_order_id' => $po->id,
                    'product_id' => $prod->id,
                    'ordered_qty' => $qtyOrdered,
                    'received_qty' => $qtyReceived,
                    'unit_cost' => $prod->cost_price,
                ]);

                if ($po->status === 'Fully Received') {
                    // Update stock
                    $inventory = Inventory::where('product_id', $prod->id)->first();
                    if ($inventory) {
                        $inventory->quantity_on_hand += $qtyOrdered;
                        $inventory->last_updated = now();
                        $inventory->save();
                    }

                    // Log stock movement
                    StockMovement::create([
                        'product_id' => $prod->id,
                        'type' => 'Stock In',
                        'quantity' => $qtyOrdered,
                        'reference_type' => PurchaseOrder::class,
                        'reference_id' => $po->id,
                        'notes' => 'Received goods for ' . $po->reference,
                        'user_id' => $testUser->id,
                    ]);
                }
            }
        }

        // 9. Seed sample Sales Orders
        for ($i = 1; $i <= 3; $i++) {
            $so = SalesOrder::create([
                'reference' => 'SO-' . date('Y') . '-' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'customer_name' => collect(['John Doe Ltd', 'Alice Springs Corp', 'Bob Construction'])->random(),
                'status' => $i === 1 ? 'Dispatched' : ($i === 2 ? 'Confirmed' : 'Draft'),
                'order_date' => now()->subDays(2 * $i),
                'dispatch_date' => $i === 1 ? now()->subDay() : null,
                'created_by' => $testUser->id,
            ]);

            // Add 1-2 items
            $productsForSO = collect($productModels)->random(rand(1, 2));
            foreach ($productsForSO as $prod) {
                $qty = rand(2, 5);
                
                SalesOrderItem::create([
                    'sales_order_id' => $so->id,
                    'product_id' => $prod->id,
                    'quantity' => $qty,
                    'unit_price' => $prod->selling_price,
                    'discount' => 0.00,
                ]);

                $inventory = Inventory::where('product_id', $prod->id)->first();
                if ($inventory) {
                    if ($so->status === 'Confirmed') {
                        // Reserve stock
                        $inventory->quantity_reserved += $qty;
                        $inventory->save();
                    } elseif ($so->status === 'Dispatched') {
                        // Deduct stock
                        $inventory->quantity_on_hand -= $qty;
                        $inventory->last_updated = now();
                        $inventory->save();

                        // Log stock movement
                        StockMovement::create([
                            'product_id' => $prod->id,
                            'type' => 'Stock Out',
                            'quantity' => $qty,
                            'reference_type' => SalesOrder::class,
                            'reference_id' => $so->id,
                            'notes' => 'Dispatched goods for ' . $so->reference,
                            'user_id' => $testUser->id,
                        ]);
                    }
                }
            }
        }

        // 10. Seed Settings
        $settings = [
            'company_name' => 'Smart Inventory Ltd',
            'company_logo' => null,
            'currency' => 'USD',
            'date_format' => 'Y-m-d',
            'timezone' => 'UTC',
            'default_reorder_level' => '15',
        ];

        foreach ($settings as $key => $val) {
            Setting::create([
                'key' => $key,
                'value' => $val,
                'group' => 'system',
            ]);
        }
    }
}
