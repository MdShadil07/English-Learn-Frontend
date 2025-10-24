-- Add restore_streak function
CREATE OR REPLACE FUNCTION public.restore_streak(days_missed INTEGER)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id UUID;
  coins_needed INTEGER;
BEGIN
  user_id := auth.uid();
  coins_needed := days_missed * 10;
  
  -- Check if user has enough coins
  IF (SELECT correction_coins FROM public.profiles WHERE id = user_id) < coins_needed THEN
    RAISE EXCEPTION 'Not enough coins to restore streak';
  END IF;
  
  -- Deduct coins and restore streak
  UPDATE public.profiles
  SET 
    correction_coins = correction_coins - coins_needed,
    last_practice_date = CURRENT_DATE
  WHERE id = user_id;
END;
$$;

-- Update the practice streak trigger to work properly
DROP TRIGGER IF EXISTS update_practice_streak_trigger ON public.speaking_sessions;

CREATE OR REPLACE FUNCTION public.update_practice_streak()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  last_date DATE;
  today_date DATE;
  current_streak_val INTEGER;
BEGIN
  today_date := CURRENT_DATE;
  
  SELECT last_practice_date, current_streak INTO last_date, current_streak_val
  FROM public.profiles
  WHERE id = NEW.user_id;
  
  -- If first practice or practiced today, initialize or don't change streak
  IF last_date IS NULL THEN
    UPDATE public.profiles
    SET current_streak = 1,
        longest_streak = GREATEST(longest_streak, 1),
        last_practice_date = today_date
    WHERE id = NEW.user_id;
  ELSIF last_date = today_date THEN
    -- Already practiced today, don't update streak
    RETURN NEW;
  ELSIF last_date = today_date - INTERVAL '1 day' THEN
    -- Consecutive day - increment streak
    UPDATE public.profiles
    SET current_streak = current_streak + 1,
        longest_streak = GREATEST(longest_streak, current_streak + 1),
        last_practice_date = today_date
    WHERE id = NEW.user_id;
  ELSE
    -- Streak broken - reset to 1
    UPDATE public.profiles
    SET current_streak = 1,
        last_practice_date = today_date
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_practice_streak_trigger
AFTER INSERT ON public.speaking_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_practice_streak();