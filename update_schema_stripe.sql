-- Add payment columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_intent_id text,
ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending'; -- 'pending', 'paid', 'failed'

-- Optional: Create an index for faster lookups by payment_intent_id
CREATE INDEX IF NOT EXISTS idx_orders_payment_intent_id ON orders(payment_intent_id);

-- Verify the changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders';
